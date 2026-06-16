// Protected route: nextdeploy.yml sets protection.protected_paths: ["/app/*"],
// so NextDeploy's edge guard runs before this renders and 302s unauthenticated
// requests to /login. Your application code goes here.
export default function Dashboard() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 48 }}>
      <h1>Dashboard</h1>
      <p>Guarded by NextDeploy's edge protection. Build your app here.</p>
    </main>
  );
}
