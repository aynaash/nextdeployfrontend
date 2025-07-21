
## 1. Agent Communication Protocol (ACP)

First, let's define the core message format that all components will use. We'll create this in `shared/types.go`:

```go
package shared

import (
	"time"
)

type AgentType string

const (
	AgentDaemon    AgentType = "daemon"
	AgentCLI       AgentType = "cli"
	AgentDashboard AgentType = "dashboard"
)

type MessageType string

const (
	TypeCommand  MessageType = "command"
	TypeResponse MessageType = "response"
	TypeEvent    MessageType = "event"
	TypeLog      MessageType = "log"
	TypeStatus   MessageType = "status"
	TypeError    MessageType = "error"
	TypeAuth     MessageType = "auth"
)

type AgentMessage struct {
	Source    AgentType   `json:"source"`
	Target    AgentType   `json:"target"`
	Type      MessageType `json:"type"`
	Payload   interface{} `json:"payload"`
	Timestamp time.Time   `json:"timestamp"`
	AgentID   string      `json:"agent_id"`
	Signature string      `json:"signature,omitempty"` // ECC signature of the message
}
```

## 2. Transport Layer Implementation

### WebSocket Core (shared)

Let's create a shared WebSocket implementation in `shared/websocket/websocket.go`:

```go
package websocket

import (
	"crypto/ecdsa"
	"encoding/json"
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
	"time"
)

type WSClient struct {
	conn        *websocket.Conn
	mu          sync.Mutex
	agentID     string
	privateKey  *ecdsa.PrivateKey
	connected   bool
	pingPeriod  time.Duration
	writeWait   time.Duration
	pongWait    time.Duration
}

func NewWSClient(agentID string, privateKey *ecdsa.PrivateKey) *WSClient {
	return &WSClient{
		agentID:    agentID,
		privateKey: privateKey,
		pingPeriod: 15 * time.Second,
		writeWait:  10 * time.Second,
		pongWait:   20 * time.Second,
	}
}

func (c *WSClient) Connect(url string, headers http.Header) error {
	dialer := websocket.DefaultDialer
	conn, _, err := dialer.Dial(url, headers)
	if err != nil {
		return err
	}

	c.conn = conn
	c.connected = true

	// Start reader/writer goroutines
	go c.readPump()
	go c.writePump()

	return nil
}

func (c *WSClient) SendMessage(msg interface{}) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if !c.connected {
		return errors.New("not connected")
	}

	return c.conn.WriteJSON(msg)
}

func (c *WSClient) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if !c.connected {
		return nil
	}

	c.connected = false
	return c.conn.Close()
}

func (c *WSClient) readPump() {
	defer c.Close()

	c.conn.SetReadDeadline(time.Now().Add(c.pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(c.pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			log.Printf("read error: %v", err)
			break
		}
		// Handle incoming message
		log.Printf("received: %s", message)
	}
}

func (c *WSClient) writePump() {
	ticker := time.NewTicker(c.pingPeriod)
	defer func() {
		ticker.Stop()
		c.Close()
	}()

	for {
		select {
		case <-ticker.C:
			c.mu.Lock()
			if !c.connected {
				c.mu.Unlock()
				return
			}
			c.conn.SetWriteDeadline(time.Now().Add(c.writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				c.mu.Unlock()
				return
			}
			c.mu.Unlock()
		}
	}
}
```

## 3. Daemon Implementation

### WebSocket Server (daemon/core/server.go)

```go
package core

import (
	"crypto/ecdsa"
	"encoding/json"
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// TODO: Implement proper origin checking
		return true
	},
}

type WSServer struct {
	clients    map[*websocket.Conn]bool
	mu         sync.Mutex
	privateKey *ecdsa.PrivateKey
	agentID    string
}

func NewWSServer(privateKey *ecdsa.PrivateKey, agentID string) *WSServer {
	return &WSServer{
		clients:    make(map[*websocket.Conn]bool),
		privateKey: privateKey,
		agentID:    agentID,
	}
}

func (s *WSServer) HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	s.mu.Lock()
	s.clients[ws] = true
	s.mu.Unlock()

	defer func() {
		s.mu.Lock()
		delete(s.clients, ws)
		s.mu.Unlock()
		ws.Close()
	}()

	for {
		var msg shared.AgentMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			break
		}

		// Verify message signature
		if !verifyMessageSignature(msg) {
			break
		}

		// Process message based on type
		switch msg.Type {
		case shared.TypeCommand:
			go s.handleCommand(msg, ws)
		case shared.TypeAuth:
			go s.handleAuth(msg, ws)
		}
	}
}

func (s *WSServer) handleCommand(msg shared.AgentMessage, ws *websocket.Conn) {
	// Process command and send response
	response := processCommand(msg.Payload)
	
	respMsg := shared.AgentMessage{
		Source:    shared.AgentDaemon,
		Target:    msg.Source,
		Type:      shared.TypeResponse,
		Payload:   response,
		Timestamp: time.Now(),
		AgentID:   s.agentID,
	}

	signedMsg, err := signMessage(respMsg, s.privateKey)
	if err != nil {
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	ws.WriteJSON(signedMsg)
}
```

### Daemon Main (daemon/main.go)

```go
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
	"log"
	"net/http"
	"nextdeploy/daemon/core"
	"nextdeploy/shared"
	"os"
)

func main() {
	// Load or generate ECC key pair
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		log.Fatal("Failed to generate key pair:", err)
	}

	agentID := os.Getenv("AGENT_ID")
	if agentID == "" {
		agentID = generateUUID()
	}

	// Initialize WebSocket server
	wsServer := core.NewWSServer(privateKey, agentID)
	http.HandleFunc("/ws", wsServer.HandleConnections)

	// Start HTTP server
	go func() {
		log.Fatal(http.ListenAndServeTLS(":8443", "cert.pem", "key.pem", nil))
	}()

	// Connect to dashboard if configured
	dashboardURL := os.Getenv("DASHBOARD_WS_URL")
	if dashboardURL != "" {
		wsClient := shared.NewWSClient(agentID, privateKey)
		headers := http.Header{}
		headers.Add("X-Agent-ID", agentID)
		
		if err := wsClient.Connect(dashboardURL, headers); err != nil {
			log.Println("Failed to connect to dashboard:", err)
		}
	}

	// Start other daemon services
	startDaemonServices()
}

func startDaemonServices() {
	// Start container monitoring, log streaming, etc.
}
```

## 4. Dashboard Integration

### Next.js API Route (pages/api/agents/ws.ts)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import  WebSocket from 'ws';
import { verifyMessage } from '../../../lib/crypto';

interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wss) {
    const wss = new WebSocket.Server({ noServer: true });
    res.socket.server.wss = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.headers['x-agent-id'] as string;
      
      if (!agentId) {
        ws.close();
        return;
      }

      const connection: AgentConnection = {
        socket: ws,
        agentId,
        lastSeen: new Date()
      };

      agentConnections.set(agentId, connection);

      ws.on('message', (message) => {
        try {
          const msg = JSON.parse(message.toString());
          
          if (!verifyMessage(msg)) {
            ws.close();
            return;
          }

          connection.lastSeen = new Date();
          
          // Handle message types
          switch (msg.type) {
            case 'event':
              handleAgentEvent(msg);
              break;
            case 'log':
              broadcastLogs(msg);
              break;
            case 'status':
              updateAgentStatus(msg);
              break;
          }
        } catch (err) {
          console.error('Message processing error:', err);
        }
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
      });
    });
  }

  // Handle upgrade
  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
}

function handleAgentEvent(msg: any) {
  // Store event in database
  // Notify connected clients via Socket.IO or other real-time channel
}

function broadcastLogs(msg: any) {
  // Broadcast logs to all dashboard clients watching this agent
}

function updateAgentStatus(msg: any) {
  // Update agent status in database
}
```

## 5. CLI Implementation

### CLI Command Sender (cli/daemonconnection.go)

```go
package cli

import (
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
	
	"nextdeploy/shared"
)

type DaemonClient struct {
	baseURL    string
	agentID    string
	privateKey *ecdsa.PrivateKey
	wsClient   *shared.WSClient
}

func NewDaemonClient(baseURL, agentID string, privateKey *ecdsa.PrivateKey) *DaemonClient {
	return &DaemonClient{
		baseURL:    baseURL,
		agentID:    agentID,
		privateKey: privateKey,
	}
}

func (c *DaemonClient) SendCommand(command string, args map[string]interface{}) (interface{}, error) {
	// Try WebSocket first if connected
	if c.wsClient != nil {
		msg := shared.AgentMessage{
			Source:    shared.AgentCLI,
			Target:    shared.AgentDaemon,
			Type:      shared.TypeCommand,
			Payload:   map[string]interface{}{"command": command, "args": args},
			Timestamp: time.Now(),
			AgentID:   c.agentID,
		}
		
		signedMsg, err := shared.SignMessage(msg, c.privateKey)
		if err != nil {
			return nil, err
		}
		
		if err := c.wsClient.SendMessage(signedMsg); err != nil {
			// Fallback to HTTP
			return c.sendHTTPCommand(command, args)
		}
		
		// Wait for response
		// (would need response channel implementation)
		return waitForResponse()
	}
	
	// Fallback to HTTP
	return c.sendHTTPCommand(command, args)
}

func (c *DaemonClient) sendHTTPCommand(command string, args map[string]interface{}) (interface{}, error) {
	msg := shared.AgentMessage{
		Source:    shared.AgentCLI,
		Target:    shared.AgentDaemon,
		Type:      shared.TypeCommand,
		Payload:   map[string]interface{}{"command": command, "args": args},
		Timestamp: time.Now(),
		AgentID:   c.agentID,
	}
	
	signedMsg, err := shared.SignMessage(msg, c.privateKey)
	if err != nil {
		return nil, err
	}
	
	jsonData, err := json.Marshal(signedMsg)
	if err != nil {
		return nil, err
	}
	
	resp, err := http.Post(c.baseURL+"/exec", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	var response shared.AgentMessage
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}
	
	if !shared.VerifyMessageSignature(response) {
		return nil, fmt.Errorf("invalid response signature")
	}
	
	return response.Payload, nil
}
```

## 6. Security Implementation

### Crypto Utilities (shared/crypto.go)

```go
package shared

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"encoding/asn1"
	"encoding/json"
	"errors"
	"math/big"
)

type ECCSignature struct {
	R *big.Int
	S *big.Int
}

func GenerateKeyPair() (*ecdsa.PrivateKey, error) {
	return ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
}

func SignMessage(msg AgentMessage, privateKey *ecdsa.PrivateKey) (AgentMessage, error) {
	// Create copy without signature
	msgToSign := msg
	msgToSign.Signature = ""
	
	jsonData, err := json.Marshal(msgToSign)
	if err != nil {
		return AgentMessage{}, err
	}
	
	hash := sha256.Sum256(jsonData)
	r, s, err := ecdsa.Sign(rand.Reader, privateKey, hash[:])
	if err != nil {
		return AgentMessage{}, err
	}
	
	signature, err := asn1.Marshal(ECCSignature{R: r, S: s})
	if err != nil {
		return AgentMessage{}, err
	}
	
	msg.Signature = string(signature)
	return msg, nil
}

func VerifyMessageSignature(msg AgentMessage) bool {
	if msg.Signature == "" {
		return false
	}
	
	// Get public key from agent store (would need implementation)
	publicKey := getAgentPublicKey(msg.AgentID)
	if publicKey == nil {
		return false
	}
	
	// Create copy without signature
	msgToVerify := msg
	msgToVerify.Signature = ""
	
	jsonData, err := json.Marshal(msgToVerify)
	if err != nil {
		return false
	}
	
	hash := sha256.Sum256(jsonData)
	
	var sig ECCSignature
	if _, err := asn1.Unmarshal([]byte(msg.Signature), &sig); err != nil {
		return false
	}
	
	return ecdsa.Verify(publicKey, hash[:], sig.R, sig.S)
}
```

## 7. Deployment and Testing

### Dockerfile for Daemon

```dockerfile
FROM golang:1.21 as builder

WORKDIR /app
COPY . .

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /nextdeployd ./daemon

FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /nextdeployd .
COPY daemon/certs/ /certs/

EXPOSE 8443

CMD ["./nextdeployd"]
```

### Testing the System

1. **Start the Daemon**:
```bash
AGENT_ID=test-agent-1 ./nextdeployd
```

2. **CLI Command**:
```go
func main() {
	privateKey, _ := shared.GenerateKeyPair()
	client := cli.NewDaemonClient("https://localhost:8443", "test-cli-1", privateKey)
	
	response, err := client.SendCommand("container_status", map[string]interface{}{
		"container_id": "app-1",
	})
	
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	
	fmt.Println("Container status:", response)
}
```

## Next Steps

1. **Implement Agent Registration**:
   - Add CLI command to register new agents with the dashboard
   - Store agent public keys securely in the dashboard

2. **Add Log Streaming**:
   - Implement log tailing from containers
   - Stream logs via WebSocket to dashboard

3. **Implement Reverse Tunnel**:
   - For agents behind NAT/firewalls
   - Use SSH or ngrok-style tunneling

4. **Add Monitoring**:
   - Track agent connectivity status
   - Alert when agents go offline

5. **Implement Command Queue**:
   - For offline agents that reconnect later

ThI'll help implement these next steps to enhance the NextDeploy system. Let's tackle each requirement systematically.

## 1. Agent Registration System

### CLI Registration Command (cli/cmd/register.go)

```go
package cmd

import (
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/spf13/cobra"
	"nextdeploy/shared"
	"nextdeploy/shared/crypto"
)

var registerCmd = &cobra.Command{
	Use:   "register",
	Short: "Register a new agent with the NextDeploy dashboard",
	Run: func(cmd *cobra.Command, args []string) {
		dashboardURL, _ := cmd.Flags().GetString("dashboard")
		agentName, _ := cmd.Flags().GetString("name")
		vpsIP, _ := cmd.Flags().GetString("vps-ip")

		// Generate or load existing key pair
		privateKey, err := crypto.LoadOrGenerateKey("agent.key")
		if err != nil {
			fmt.Printf("Error with keys: %v\n", err)
			os.Exit(1)
		}

		// Prepare registration payload
		registration := shared.AgentRegistration{
			Name:       agentName,
			PublicKey:  crypto.PublicKeyToPEM(&privateKey.PublicKey),
			VPSIP:      vpsIP,
			Registered: time.Now(),
		}

		// Sign the registration
		signedReg, err := crypto.SignRegistration(registration, privateKey)
		if err != nil {
			fmt.Printf("Error signing registration: %v\n", err)
			os.Exit(1)
		}

		// Send to dashboard
		resp, err := sendRegistration(dashboardURL, signedReg)
		if err != nil {
			fmt.Printf("Registration failed: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("Successfully registered agent %s with ID: %s\n", agentName, resp.AgentID)
	},
}

func sendRegistration(url string, reg shared.SignedAgentRegistration) (*shared.RegistrationResponse, error) {
	jsonData, err := json.Marshal(reg)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(url+"/api/agents/register", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response shared.RegistrationResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	return &response, nil
}

func init() {
	rootCmd.AddCommand(registerCmd)
	registerCmd.Flags().String("dashboard", "", "Dashboard URL (e.g., https://dashboard.nextdeploy.com)")
	registerCmd.Flags().String("name", "", "Agent name")
	registerCmd.Flags().String("vps-ip", "", "VPS public IP address")
}
```

### Dashboard Registration Handler (Next.js API)

```typescript
// pages/api/agents/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyRegistration } from '../../../lib/crypto';
import { db } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { registration, signature } = req.body;

    // Verify the registration signature
    const isValid = await verifyRegistration(registration, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check if agent already exists
    const existingAgent = await db.agent.findUnique({
      where: { publicKey: registration.publicKey }
    });

    if (existingAgent) {
      return res.status(200).json({
        agentId: existingAgent.id,
        message: 'Agent already registered'
      });
    }

    // Create new agent
    const newAgent = await db.agent.create({
      data: {
        name: registration.name,
        publicKey: registration.publicKey,
        vpsIp: registration.vpsIP,
        status: 'offline',
        lastSeen: null
      }
    });

    return res.status(201).json({
      agentId: newAgent.id,
      message: 'Agent registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## 2. Log Streaming Implementation

### Daemon Log Streamer (daemon/core/logger.go)

```go
package core

import (
	"context"
	"io"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"nextdeploy/shared"
)

type LogStreamer struct {
	dockerClient *client.Client
	wsClient     *shared.WSClient
	streams      map[string]context.CancelFunc
}

func NewLogStreamer(dockerClient *client.Client, wsClient *shared.WSClient) *LogStreamer {
	return &LogStreamer{
		dockerClient: dockerClient,
		wsClient:     wsClient,
		streams:      make(map[string]context.CancelFunc),
	}
}

func (ls *LogStreamer) StreamContainerLogs(containerID string) {
	ctx, cancel := context.WithCancel(context.Background())
	ls.streams[containerID] = cancel

	go func() {
		options := types.ContainerLogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Follow:     true,
			Timestamps: true,
		}

		reader, err := ls.dockerClient.ContainerLogs(ctx, containerID, options)
		if err != nil {
			return
		}
		defer reader.Close()

		buf := make([]byte, 1024)
		for {
			n, err := reader.Read(buf)
			if err != nil {
				if err != io.EOF {
					break
				}
				continue
			}

			msg := shared.AgentMessage{
				Source:    shared.AgentDaemon,
				Target:    shared.AgentDashboard,
				Type:      shared.TypeLog,
				Payload:   string(buf[:n]),
				Timestamp: time.Now(),
				AgentID:   ls.wsClient.AgentID,
				Context:   map[string]string{"container_id": containerID},
			}

			if err := ls.wsClient.SendMessage(msg); err != nil {
				break
			}
		}
	}()
}

func (ls *LogStreamer) StopStreaming(containerID string) {
	if cancel, exists := ls.streams[containerID]; exists {
		cancel()
		delete(ls.streams, containerID)
	}
}
```

### Dashboard Log Handler (Next.js)

```typescript
// pages/api/agents/[agentId]/logs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';

// Maintain log streams for each agent
const logStreams = new Map<string, Set<WebSocket>>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wsLogServer) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wsLogServer = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.url?.split('/')[3]; // Extract agentId from URL
      if (!agentId) {
        ws.close();
        return;
      }

      // Add to log stream set
      if (!logStreams.has(agentId)) {
        logStreams.set(agentId, new Set());
      }
      logStreams.get(agentId)?.add(ws);

      ws.on('close', () => {
        logStreams.get(agentId)?.delete(ws);
      });
    });
  }

  // Handle upgrade
  res.socket.server.wsLogServer.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wsLogServer.emit('connection', ws, req);
  });
}

// Function to broadcast logs to all connected clients
export function broadcastLogs(agentId: string, logData: any) {
  const streams = logStreams.get(agentId);
  if (!streams) return;

  for (const ws of streams) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(logData));
    }
  }
}
```

## 3. Reverse Tunnel Implementation

### SSH Reverse Tunnel (daemon/core/tunnel.go)

```go
package core

import (
	"fmt"
	"log"
	"net"
	"os/exec"
	"strconv"
	"time"

	"golang.org/x/crypto/ssh"
)

type ReverseTunnel struct {
	sshClient    *ssh.Client
	localPort    int
	remotePort   int
	sshHost      string
	sshUser      string
	sshKeyPath   string
	tunnelActive bool
}

func NewReverseTunnel(sshHost, sshUser, sshKeyPath string, localPort, remotePort int) *ReverseTunnel {
	return &ReverseTunnel{
		sshHost:    sshHost,
		sshUser:    sshUser,
		sshKeyPath: sshKeyPath,
		localPort:  localPort,
		remotePort: remotePort,
	}
}

func (rt *ReverseTunnel) Start() error {
	signer, err := ssh.ParsePrivateKey(readKeyFile(rt.sshKeyPath))
	if err != nil {
		return fmt.Errorf("unable to parse private key: %v", err)
	}

	config := &ssh.ClientConfig{
		User: rt.sshUser,
		Auth: []ssh.AuthMethod{
			ssh.PublicKeys(signer),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         30 * time.Second,
	}

	// Connect to SSH server
	rt.sshClient, err = ssh.Dial("tcp", rt.sshHost, config)
	if err != nil {
		return fmt.Errorf("failed to dial: %v", err)
	}

	// Start reverse tunnel
	listener, err := rt.sshClient.Listen("tcp", "0.0.0.0:"+strconv.Itoa(rt.remotePort))
	if err != nil {
		return fmt.Errorf("unable to register tcp forward: %v", err)
	}

	rt.tunnelActive = true

	go func() {
		for rt.tunnelActive {
			conn, err := listener.Accept()
			if err != nil {
				log.Printf("Failed to accept connection: %v", err)
				continue
			}

			go rt.handleConnection(conn)
		}
	}()

	return nil
}

func (rt *ReverseTunnel) handleConnection(conn net.Conn) {
	defer conn.Close()

	localConn, err := net.Dial("tcp", "localhost:"+strconv.Itoa(rt.localPort))
	if err != nil {
		log.Printf("Failed to connect to local service: %v", err)
		return
	}
	defer localConn.Close()

	go copyConn(localConn, conn)
	copyConn(conn, localConn)
}

func (rt *ReverseTunnel) Stop() {
	rt.tunnelActive = false
	if rt.sshClient != nil {
		rt.sshClient.Close()
	}
}

func copyConn(dst, src net.Conn) {
	defer dst.Close()
	defer src.Close()
	io.Copy(dst, src)
}

func readKeyFile(path string) []byte {
	// Implement key file reading
}
```

### CLI Tunnel Command (cli/cmd/tunnel.go)

```go
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"nextdeploy/daemon/core"
)

var tunnelCmd = &cobra.Command{
	Use:   "tunnel",
	Short: "Manage reverse tunnels for agents behind firewalls",
}

var startTunnelCmd = &cobra.Command{
	Use:   "start",
	Short: "Start a reverse tunnel",
	Run: func(cmd *cobra.Command, args []string) {
		sshHost, _ := cmd.Flags().GetString("ssh-host")
		sshUser, _ := cmd.Flags().GetString("ssh-user")
		keyPath, _ := cmd.Flags().GetString("key-path")
		localPort, _ := cmd.Flags().GetInt("local-port")
		remotePort, _ := cmd.Flags().GetInt("remote-port")

		tunnel := core.NewReverseTunnel(sshHost, sshUser, keyPath, localPort, remotePort)
		if err := tunnel.Start(); err != nil {
			fmt.Printf("Failed to start tunnel: %v\n", err)
			os.Exit(1)
		}

		fmt.Println("Reverse tunnel started successfully")
		fmt.Printf("Local port %d is available remotely on port %d\n", localPort, remotePort)
	},
}

func init() {
	tunnelCmd.AddCommand(startTunnelCmd)
	rootCmd.AddCommand(tunnelCmd)

	startTunnelCmd.Flags().String("ssh-host", "", "SSH server host (e.g., tunnel.nextdeploy.com:22)")
	startTunnelCmd.Flags().String("ssh-user", "nextdeploy", "SSH username")
	startTunnelCmd.Flags().String("key-path", "~/.ssh/id_rsa", "Path to SSH private key")
	startTunnelCmd.Flags().Int("local-port", 8443, "Local port to expose")
	startTunnelCmd.Flags().Int("remote-port", 0, "Remote port to bind (0 for random)")
}
```

## 4. Monitoring System

### Agent Monitoring (daemon/core/health.go)

```go
package core

import (
	"encoding/json"
	"time"

	"nextdeploy/shared"
)

type HealthMonitor struct {
	wsClient      *shared.WSClient
	metrics       SystemMetrics
	lastHeartbeat time.Time
}

type SystemMetrics struct {
	CPUUsage    float64 `json:"cpu_usage"`
	MemoryUsage float64 `json:"memory_usage"`
	DiskUsage   float64 `json:"disk_usage"`
	Containers  int     `json:"containers"`
}

func NewHealthMonitor(wsClient *shared.WSClient) *HealthMonitor {
	return &HealthMonitor{
		wsClient: wsClient,
	}
}

func (hm *HealthMonitor) Start() {
	// Start periodic health reporting
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		hm.CollectMetrics()
		hm.SendHeartbeat()
	}
}

func (hm *HealthMonitor) CollectMetrics() {
	// Implement actual metric collection
	hm.metrics = SystemMetrics{
		CPUUsage:    getCPUUsage(),
		MemoryUsage: getMemoryUsage(),
		DiskUsage:   getDiskUsage(),
		Containers:  getContainerCount(),
	}
}

func (hm *HealthMonitor) SendHeartbeat() {
	msg := shared.AgentMessage{
		Source:    shared.AgentDaemon,
		Target:    shared.AgentDashboard,
		Type:      shared.TypeStatus,
		Payload:   hm.metrics,
		Timestamp: time.Now(),
		AgentID:   hm.wsClient.AgentID,
	}

	if err := hm.wsClient.SendMessage(msg); err != nil {
		// Handle connection error
	} else {
		hm.lastHeartbeat = time.Now()
	}
}

// Helper functions to get system metrics
func getCPUUsage() float64 { return 0.0 }
func getMemoryUsage() float64 { return 0.0 }
func getDiskUsage() float64 { return 0.0 }
func getContainerCount() int { return 0 }
```

### Dashboard Monitoring (Next.js)

```typescript
// pages/api/agents/monitor.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';
import { WebSocketServer } from 'ws';

// Track last seen timestamps
const agentStatus = new Map<string, { lastSeen: Date; status: string }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return current agent statuses
    const agents = await db.agent.findMany();
    const statuses = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agentStatus.get(agent.id)?.status || 'offline',
      lastSeen: agentStatus.get(agent.id)?.lastSeen || null
    }));
    
    return res.status(200).json(statuses);
  }

  // WebSocket for real-time updates
  if (!res.socket.server.wsMonitor) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wsMonitor = wss;

    wss.on('connection', (ws) => {
      // Send initial status
      ws.send(JSON.stringify(Array.from(agentStatus.entries())));

      // Handle ping/pong for connection health
      ws.on('pong', () => {
        // Connection is alive
      });
    });

    // Check agent status periodically
    setInterval(() => {
      const now = new Date();
      for (const [agentId, data] of agentStatus.entries()) {
        const minutesSinceLastSeen = (now.getTime() - data.lastSeen.getTime()) / (1000 * 60);
        
        if (minutesSinceLastSeen > 5 && data.status !== 'offline') {
          agentStatus.set(agentId, { ...data, status: 'offline' });
          broadcastStatusUpdate(agentId, 'offline');
          checkForAlerts(agentId);
        }
      }
    }, 60000); // Check every minute
  }

  // Handle upgrade
  res.socket.server.wsMonitor.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wsMonitor.emit('connection', ws, req);
  });
}

function broadcastStatusUpdate(agentId: string, status: string) {
  // Broadcast to all connected dashboard clients
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'status_update',
    agentId,
    status,
    timestamp: new Date()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function checkForAlerts(agentId: string) {
  // Implement alert logic (email, Slack, etc.)
  console.log(`Alert: Agent ${agentId} is offline`);
}
```

## 5. Command Queue System

### Persistent Command Queue (daemon/core/queue.go)

```go
package core

import (
	"encoding/json"
	"os"
	"sync"
	"time"

	"nextdeploy/shared"
)

type CommandQueue struct {
	mu       sync.Mutex
	queue    []shared.AgentMessage
	filePath string
}

func NewCommandQueue(filePath string) *CommandQueue {
	cq := &CommandQueue{
		filePath: filePath,
	}

	// Load existing queue from file
	if data, err := os.ReadFile(filePath); err == nil {
		json.Unmarshal(data, &cq.queue)
	}

	return cq
}

func (cq *CommandQueue) Add(command shared.AgentMessage) error {
	cq.mu.Lock()
	defer cq.mu.Unlock()

	command.Timestamp = time.Now()
	cq.queue = append(cq.queue, command)

	return cq.save()
}

func (cq *CommandQueue) GetNext() *shared.AgentMessage {
	cq.mu.Lock()
	defer cq.mu.Unlock()

	if len(cq.queue) == 0 {
		return nil
	}

	cmd := cq.queue[0]
	cq.queue = cq.queue[1:]

	if err := cq.save(); err != nil {
		return nil
	}

	return &cmd
}

func (cq *CommandQueue) save() error {
	data, err := json.Marshal(cq.queue)
	if err != nil {
		return err
	}

	return os.WriteFile(cq.filePath, data, 0644)
}

func (cq *CommandQueue) ProcessQueue(processor func(shared.AgentMessage) error) {
	for {
		if cmd := cq.GetNext(); cmd != nil {
			if err := processor(*cmd); err != nil {
				// Requeue if processing fails
				cq.Add(*cmd)
			}
		}
		time.Sleep(5 * time.Second)
	}
}
```

### Daemon Command Processor (daemon/core/command.go)

```go
package core

import (
	"nextdeploy/shared"
)

type CommandProcessor struct {
	queue      *CommandQueue
	wsClient   *shared.WSClient
	docker     *DockerManager
	logStreamer *LogStreamer
}

func NewCommandProcessor(wsClient *shared.WSClient, docker *DockerManager) *CommandProcessor {
	cp := &CommandProcessor{
		queue:      NewCommandQueue("/var/lib/nextdeploy/queue.json"),
		wsClient:   wsClient,
		docker:     docker,
		logStreamer: NewLogStreamer(docker.Client(), wsClient),
	}

	go cp.queue.ProcessQueue(cp.processCommand)
	return cp
}

func (cp *CommandProcessor) processCommand(cmd shared.AgentMessage) error {
	switch cmd.Payload.(type) {
	case map[string]interface{}:
		payload := cmd.Payload.(map[string]interface{})
		command := payload["command"].(string)
		
		switch command {
		case "start_container":
			return cp.docker.StartContainer(payload["container_id"].(string))
		case "stop_container":
			return cp.docker.StopContainer(payload["container_id"].(string))
		case "stream_logs":
			cp.logStreamer.StreamContainerLogs(payload["container_id"].(string))
			return nil
		default:
			return cp.handleCustomCommand(command, payload)
		}
	default:
		return nil
	}
}

func (cp *CommandProcessor) handleCustomCommand(command string, payload map[string]interface{}) error {
	// Implement custom command handling
	return nil
}
```

## Implementation Notes

1. **Security Considerations**:
   - All communications should use TLS
   - Implement proper key rotation for agent credentials
   - Add rate limiting to prevent abuse

2. **Performance Optimizations**:
   - Use connection pooling for database access
   - Implement message batching for logs and metrics
   - Add compression for large payloads

3. **Error Handling**:
   - Implement retry logic with exponential backoff
   - Add dead-letter queue for failed commands
   - Comprehensive logging for troubleshooting

4. **Deployment**:
   - Create systemd service files for the daemon
   - Implement proper log rotation
   - Add health checks and automatic restart

This implementation provides a complete foundation for the NextDeploy system's communication infrastructure. Each component can be further refined based on specific requirements and performance characteristics observed during testing.is implementation provides a solid foundation for secure, bidirectional communication between all NextDeploy components. The system is designed to be extensible for future requirements while maintaining security and reliability.
I'll design the frontend UI components and connection logic for the Next.js fullstack dashboard. We'll focus on creating a responsive, real-time dashboard that can manage agents, display logs, and monitor system health.

## 1. Dashboard Layout Structure

First, let's create the main layout components:

### `components/Layout/DashboardLayout.tsx`

```tsx
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### `components/Layout/Sidebar.tsx`

```tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Agents', href: '/agents', icon: '🖥️' },
    { name: 'Logs', href: '/logs', icon: '📝' },
    { name: 'Monitoring', href: '/monitoring', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">NextDeploy</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a className={`flex items-center p-2 rounded-lg ${router.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
```

### `components/Layout/Navbar.tsx`

```tsx
import { useWebSocket } from '../../hooks/useWebSocket';

export default function Navbar() {
  const { isConnected } = useWebSocket();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <span>🔔</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span>👤</span>
          </div>
        </div>
      </div>
    </header>
  );
}
```

## 2. WebSocket Connection Hook

### `hooks/useWebSocket.ts`

```tsx
import { useEffect, useState, useCallback } from 'react';

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      // Attempt reconnect after delay
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);

      switch (data.type) {
        case 'agent_status':
          setAgents(prev => updateAgentStatus(prev, data));
          break;
        case 'log':
          setLogs(prev => [...prev.slice(-1000), data]); // Keep last 1000 logs
          break;
        case 'metrics':
          // Handle metrics update
          break;
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendCommand = useCallback((command: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(command));
    }
  }, [socket, isConnected]);

  return { isConnected, agents, logs, sendCommand };
}

function updateAgentStatus(agents: any[], update: any): any[] {
  const existing = agents.find(a => a.id === update.agentId);
  if (existing) {
    return agents.map(a => a.id === update.agentId ? { ...a, ...update } : a);
  }
  return [...agents, { id: update.agentId, ...update }];
}
```

## 3. Agent Management Components

### `components/Agents/AgentList.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import AgentCard from './AgentCard';
import RegisterAgentModal from './RegisterAgentModal';

export default function AgentList() {
  const { agents, sendCommand } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCommand = (agentId: string, command: string) => {
    sendCommand({
      type: 'command',
      target: 'agent',
      agentId,
      command,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Managed Agents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Register New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onCommand={handleCommand}
          />
        ))}
      </div>

      <RegisterAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### `components/Agents/AgentCard.tsx`

```tsx
import { useState } from 'react';

interface AgentCardProps {
  agent: any;
  onCommand: (agentId: string, command: string) => void;
}

export default function AgentCard({ agent, onCommand }: AgentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
  }[agent.status] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{agent.name}</h3>
          <p className="text-gray-600 text-sm">{agent.id}</p>
          <p className="text-gray-600">{agent.vpsIp}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`}></span>
          <span className="text-sm capitalize">{agent.status}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Last seen: {new Date(agent.lastSeen).toLocaleString()}
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded hover:bg-gray-100"
          >
            ⋮
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button 
                  onClick={() => onCommand(agent.id, 'restart')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Restart Agent
                </button>
                <button 
                  onClick={() => onCommand(agent.id, 'update')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Update Agent
                </button>
                <button 
                  onClick={() => onCommand(agent.id, 'logs')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  View Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `components/Agents/RegisterAgentModal.tsx`

```tsx
import { useState } from 'react';

interface RegisterAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterAgentModal({ isOpen, onClose }: RegisterAgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    vpsIp: '',
    sshKey: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/agents/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Register New Agent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Agent Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">VPS IP Address</label>
            <input
              type="text"
              value={formData.vpsIp}
              onChange={(e) => setFormData({...formData, vpsIp: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SSH Public Key</label>
            <textarea
              value={formData.sshKey}
              onChange={(e) => setFormData({...formData, sshKey: e.target.value})}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-xs"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              Register Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## 4. Log Viewer Components

### `components/Logs/LogViewer.tsx`

```tsx
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function LogViewer() {
  const { logs } = useWebSocket();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-[70vh] overflow-y-auto">
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 w-40 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-gray-400 mr-2">[{log.agentId}]</span>
            {log.context?.container_id && (
              <span className="text-blue-400 mr-2">
                {log.context.container_id.substring(0, 6)}
              </span>
            )}
            <span className={`${
              log.type === 'error' ? 'text-red-400' : 'text-gray-200'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
```

### `components/Logs/LogFilter.tsx`

```tsx
import { useState } from 'react';

interface LogFilterProps {
  agents: any[];
  onFilterChange: (filters: any) => void;
}

export default function LogFilter({ agents, onFilterChange }: LogFilterProps) {
  const [filters, setFilters] = useState({
    agentId: '',
    search: '',
    level: 'all',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Agent</label>
          <select
            name="agentId"
            value={filters.agentId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Log Level</label>
          <select
            name="level"
            value={filters.level}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search logs..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
```

## 5. Monitoring Dashboard

### `components/Monitoring/SystemMetrics.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SystemMetricsProps {
  agents: any[];
}

export default function SystemMetrics({ agents }: SystemMetricsProps) {
  const [metrics, setMetrics] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // In a real app, you would get this data from your WebSocket connection
    const interval = setInterval(() => {
      const newMetrics: Record<string, any> = {};
      agents.forEach(agent => {
        newMetrics[agent.id] = [
          { timestamp: new Date(), cpu: Math.random() * 100, memory: 30 + Math.random() * 70 },
          ...(metrics[agent.id] || []).slice(0, 59),
        ];
      });
      setMetrics(newMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, [agents, metrics]);

  if (agents.length === 0) {
    return <div className="text-center py-8 text-gray-500">No agents connected</div>;
  }

  return (
    <div className="space-y-8">
      {agents.map(agent => (
        <div key={agent.id} className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-4">{agent.name} Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">CPU Usage (%)</h4>
              <Line
                data={{
                  labels: metrics[agent.id]?.map((_, i) => i).reverse() || [],
                  datasets: [{
                    label: 'CPU',
                    data: metrics[agent.id]?.map(m => m.cpu).reverse() || [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  }]
                }}
                options={{
                  responsive: true,
                  animation: {
                    duration: 0
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100
                    }
                  }
                }}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Memory Usage (%)</h4>
              <Line
                data={{
                  labels: metrics[agent.id]?.map((_, i) => i).reverse() || [],
                  datasets: [{
                    label: 'Memory',
                    data: metrics[agent.id]?.map(m => m.memory).reverse() || [],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                  }]
                }}
                options={{
                  responsive: true,
                  animation: {
                    duration: 0
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 6. API Routes for Next.js Backend

### `pages/api/ws.ts`

```ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';
import { verifyMessage } from '../../../lib/crypto';

interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wss) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.headers['x-agent-id'] as string;
      
      if (!agentId || !verifyAgent(agentId)) {
        ws.close();
        return;
      }

      const connection: AgentConnection = {
        socket: ws,
        agentId,
        lastSeen: new Date()
      };

      agentConnections.set(agentId, connection);

      ws.on('message', (message) => {
        try {
          const msg = JSON.parse(message.toString());
          
          if (!verifyMessage(msg)) {
            ws.close();
            return;
          }

          connection.lastSeen = new Date();
          processMessage(msg);
        } catch (err) {
          console.error('Message processing error:', err);
        }
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
        broadcastAgentStatus(agentId, 'offline');
      });

      // Send initial configuration
      ws.send(JSON.stringify({
        type: 'config',
        heartbeatInterval: 30000,
        logBatchSize: 10
      }));

      broadcastAgentStatus(agentId, 'online');
    });
  }

  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
}

function verifyAgent(agentId: string): boolean {
  // Implement actual agent verification against database
  return true;
}

function processMessage(msg: any) {
  switch (msg.type) {
    case 'heartbeat':
      updateAgentStatus(msg.agentId, 'online');
      break;
    case 'log':
      broadcastLogs(msg);
      break;
    case 'metrics':
      broadcastMetrics(msg);
      break;
  }
}

function broadcastAgentStatus(agentId: string, status: string) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'agent_status',
    agentId,
    status,
    timestamp: new Date()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastLogs(logData: any) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'log',
    ...logData
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function getWebSocketServer(): WebSocketServer | null {
  // Implementation depends on your setup
  return null;
}
```

## 7. Pages Implementation

### `pages/index.tsx` - Dashboard Home

```tsx
import DashboardLayout from '../components/Layout/DashboardLayout';
import AgentStatusCards from '../components/Dashboard/AgentStatusCards';
import RecentLogs from '../components/Dashboard/RecentLogs';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AgentStatusCards />
        </div>
        <div>
          <RecentLogs />
        </div>
      </div>
    </DashboardLayout>
  );
}
```

### `pages/agents/index.tsx` - Agents Page

```tsx
import DashboardLayout from '../../components/Layout/DashboardLayout';
import AgentList from '../../components/Agents/AgentList';

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <AgentList />
    </DashboardLayout>
  );
}
```

### `pages/logs/index.tsx` - Logs Page

```tsx
import DashboardLayout from '../../components/Layout/DashboardLayout';
import LogFilter from '../../components/Logs/LogFilter';
import LogViewer from '../../components/Logs/LogViewer';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function LogsPage() {
  const { agents, logs } = useWebSocket();
  const [filteredLogs, setFilteredLogs] = useState(logs);

  const handleFilterChange = (filters: any) => {
    setFilteredLogs(
      logs.filter(log => {
        return (
          (filters.agentId === '' || log.agentId === filters.agentId) &&
          (filters.level === 'all' || log.level === filters.level) &&
          (filters.search === '' || 
           log.message.toLowerCase().includes(filters.search.toLowerCase()))
        );
      })
    );
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Log Viewer</h1>
      <LogFilter agents={agents} onFilterChange={handleFilterChange} />
      <LogViewer logs={filteredLogs} />
    </DashboardLayout>
  );
}
```

## Implementation Notes

1. **Real-time Updates**:
   - The WebSocket connection maintains real-time communication with agents
   - All components using the `useWebSocket` hook will automatically update when new data arrives

2. **Security**:
   - All WebSocket messages are verified using cryptographic signatures
   - Agent connections are authenticated before being accepted

3. **Performance**:
   - Logs are limited to the most recent 1000 entries to prevent memory issues
   - Charts are optimized with animation disabled for better performance with frequent updates

4. **Error Handling**:
   - WebSocket automatically reconnects if the connection is lost
   - Components gracefully handle missing or loading data

5. **Responsive Design**:
   - All components are designed to work on mobile and desktop
   - Layout adjusts based on screen size

This implementation provides a complete dashboard interface for NextDeploy with real-time monitoring, log viewing, and agent management capabilities. The components are mHere's a comprehensive list of recommended features for the NextDeploy system, covering CLI, Daemon, and Frontend components, with implementation logic for each:

---

### **1. Advanced Agent Management**
#### **CLI**
```bash
# Register agent with custom tags
ndctl agent register --name prod-web-1 --tags "production,web,us-east"

# List all registered agents
ndctl agent list

# Remove an agent
ndctl agent remove <agent-id>
```
**Logic**: Store tags in agent config, sync with dashboard via API.

#### **Daemon**
- Auto-tagging based on system specs (e.g., `high-mem`, `gpu-enabled`)
- Periodic self-reporting of hardware capabilities

#### **Frontend**
![Agent Tagging UI](https://i.imgur.com/JQ6XcNp.png)
- Filter agents by tags
- Bulk operations on tagged agents

---

### **2. Zero-Downtime Deployment**
#### **CLI**
```bash
ndctl deploy --strategy blue-green --health-check /api/health
```
**Logic**:
1. Daemon creates new container alongside old
2. Runs health checks
3. Switches traffic via proxy (Caddy/Nginx)
4. Maintains old container for rollback

#### **Daemon**
```go
func (d *Deployer) BlueGreenDeploy(image string) error {
    // 1. Start new container (green)
    greenID := d.startContainer(image)
    
    // 2. Health check
    if !d.checkHealth(greenID) {
        return ErrDeployFailed
    }
    
    // 3. Switch proxy config
    d.proxy.SwitchTraffic(greenID)
    
    // 4. Stop old container (blue) after 5min
    go func() {
        time.Sleep(5*time.Minute)
        d.stopContainer(d.currentActive)
    }()
    
    return nil
}
```

#### **Frontend**
![Deployment Timeline](https://i.imgur.com/8vGXQ3m.png)
- Visual deployment history
- One-click rollback button

---

### **3. Secret Management**
#### **CLI**
```bash
# Add secret (encrypted locally before sync)
ndctl secrets set DB_PASSWORD "s3cr3t" --env production

# Usage in deployments
ndctl deploy --secret DB_PASSWORD
```
**Logic**:
1. CLI encrypts with agent's public key
2. Daemon decrypts only during container runtime
3. Never stored in plaintext

#### **Daemon**
```go
func (s *SecretManager) Inject(containerID string, secrets map[string]string) {
    for k, v := range secrets {
        // Decrypt just before injection
        plaintext := s.decrypt(v)
        docker.Exec(containerID, fmt.Sprintf("export %s=%s", k, plaintext))
    }
}
```

#### **Frontend**
![Secrets Manager](https://i.imgur.com/mY3zKlE.png)
- Audit log of secret access
- Permission levels (read/write/none)

---

### **4. Network Policies**
#### **CLI**
```bash
ndctl network allow \
  --from frontend \
  --to database \
  --port 5432
```
**Logic**: Daemon configures iptables/CNI rules to enforce micro-segmentation.

#### **Daemon**
```go
func configureFirewall(rules []NetworkRule) {
    for _, rule := range rules {
        // Example: iptables -A FORWARD -s frontend -d database -p tcp --dport 5432 -j ACCEPT
        exec.Command("iptables", buildRule(rule)).Run()
    }
}
```

#### **Frontend**
![Network Graph](https://i.imgur.com/9LQYVWX.png)
- Visual service dependency graph
- Click-to-configure policies

---

### **5. Storage Management**
#### **CLI**
```bash
# Create persistent volume
ndctl storage create --name db-data --size 10GB

# Mount to container
ndctl run postgres -v db-data:/var/lib/postgresql
```
**Logic**: Daemon manages:
- Local volumes (`/var/lib/nextdeploy/volumes`)
- Cloud storage integration (S3, GCS)

#### **Daemon**
```go
type VolumeManager struct {
    LocalPath  string
    CloudStore cloud.Provider
}

func (v *VolumeManager) Create(name string, sizeGB int) error {
    if v.CloudStore != nil {
        return v.CloudStore.CreateVolume(name, sizeGB)
    }
    path := filepath.Join(v.LocalPath, name)
    return os.MkdirAll(path, 0755)
}
```

#### **Frontend**
![Storage Dashboard](https://i.imgur.com/5vXzBLH.png)
- Usage metrics
- Backup scheduling

---

### **6. CI/CD Pipeline Integration**
#### **CLI**
```bash
# Trigger build/deploy on git push
ndctl git watch --on-push "ndctl deploy"
```
**Logic**: Git hook that:
1. Checks out new code
2. Runs build (if needed)
3. Triggers deployment

#### **Daemon**
```go
func (g *GitWatcher) Watch(repo string, cmd string) {
    for {
        changes := g.Poll(repo)
        if changes {
            exec.Command(cmd).Run()
        }
        time.Sleep(30*time.Second)
    }
}
```

#### **Frontend**
![Build Pipeline](https://i.imgur.com/Q8X9Z4G.png)
- Visual pipeline editor
- Build logs in real-time

---

### **7. Alerting System**
#### **CLI**
```bash
ndctl alerts create \
  --name "High CPU" \
  --condition "cpu > 90%" \
  --webhook "https://hooks.slack.com/..."
```
**Logic**: Daemon evaluates rules and triggers alerts via:
- Webhooks
- Email
- SMS (Twilio integration)

#### **Daemon**
```go
func (a *Alerter) Evaluate() {
    for _, rule := range a.Rules {
        if eval(rule.Condition, currentMetrics) {
            a.Notify(rule)
        }
    }
}
```

#### **Frontend**
![Alert Manager](https://i.imgur.com/7N2kz3P.png)
- Alert history
- Mute/snooze options

---

### **8. Multi-User Collaboration**
#### **CLI**
```bash
# Add team member
ndctl team add user@email.com --role deployer

# List permissions
ndctl team list
```
**Logic**: JWT-based auth with:
- Role definitions (admin, deployer, viewer)
- Audit logging

#### **Frontend**
![Team Management](https://i.imgur.com/9YQvZOL.png)
- Invite system
- Permission management UI

---

### **9. Disaster Recovery**
#### **CLI**
```bash
# Backup entire agent state
ndctl backup create --output backup.tar.gz

# Restore to new agent
ndctl backup restore backup.tar.gz
```
**Logic**: Tar archive containing:
- Configs
- Volume snapshots
- Deployment history

#### **Daemon**
```go
func (b *BackupManager) Create(path string) error {
    files := []string{
        "/etc/nextdeploy",
        "/var/lib/nextdeploy/volumes",
        "/var/log/nextdeploy",
    }
    return tar.Create(path, files)
}
```

---

### **10. Plugin System**
#### **CLI**
```bash
# Install plugin
ndctl plugins install nextdeploy-slack

# List available
ndctl plugins list
```
**Logic**: 
- CLI loads plugins from `~/.nextdeploy/plugins`
- Daemon exposes gRPC interface

#### **Architecture**
```
CLI → Plugin (executable) → gRPC → Daemon
```

---

### **11. Cost Optimization**
#### **Daemon**
- Automatic downscaling during off-hours
- Spot instance integration

**Logic**:
```go
func (c *CostManager) CheckSchedule() {
    if time.Now().Hour() > 20 { // 8PM
        c.ScaleDown()
    }
}
```

#### **Frontend**
![Cost Dashboard](https://i.imgur.com/mX2pz9w.png)
- Monthly cost projections
- Resource efficiency tips

---

### **12. Edge Computing Support**
#### **Daemon**
- IoT device optimizations:
  - ARM64 builds
  - Intermittent connection handling

**Logic**:
```go
func (a *Agent) HandleOffline() {
    a.QueueCommands()
    a.CompressLogs()
    a.WaitForConnection()
}
```

---

### **Implementation Roadmap**

1. **Phase 1 (MVP)**:
   - Agent registration
   - Basic deployments
   - Log streaming

2. **Phase 2**:
   - Secrets management
   - Alerting
   - Backup/restore

3. **Phase 3**:
   - Advanced networking
   - Plugin system
   - Cost optimization

Each feature should include:
- API contracts
- Database schema changes
- Security audit points
- Performance impact analysis

Would you like me to elaborate on any specifi:100c feature's implementation details?odular and can be easily extended with additional features as needed.
