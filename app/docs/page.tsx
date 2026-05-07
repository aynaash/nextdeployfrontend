import { Sparkles } from "lucide-react";
import { CodeBlock } from "@/components/copy-button";
import GitHubStarButton from "@/components/github-star-button";

export const revalidate = 3600;

const REPO = "aynaash/NextDeploy";
const REPO_URL = `https://github.com/${REPO}`;

type Release = {
  tag: string | null;
  date: string | null;
  url: string;
};

async function getLatestRelease(): Promise<Release> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      tag_name?: string;
      published_at?: string;
      html_url?: string;
    };
    return {
      tag: data.tag_name ?? null,
      date: data.published_at ?? null,
      url: data.html_url ?? `${REPO_URL}/releases`,
    };
  } catch {
    return { tag: null, date: null, url: `${REPO_URL}/releases` };
  }
}

const CLI_COMMANDS: { cmd: string; desc: string }[] = [
  { cmd: "nextdeploy init", desc: "Scaffold nextdeploy.yml in your Next.js project." },
  { cmd: "nextdeploy plan", desc: "Show what would happen — change nothing." },
  { cmd: "nextdeploy build", desc: "Run the build stage only — produce the artifact + metadata." },
  { cmd: "nextdeploy ship", desc: "Build and deploy to the configured target (VPS / AWS / Cloudflare)." },
  { cmd: "nextdeploy prepare", desc: "Provision a fresh Linux VPS (Caddy, nextdeployd, Fail2Ban)." },
  { cmd: "nextdeploy logs", desc: "Tail live application logs from the deployment." },
  { cmd: "nextdeploy status", desc: "Show health, current release, and route summary." },
  { cmd: "nextdeploy rollback", desc: "Revert to the previous release." },
  { cmd: "nextdeploy destroy", desc: "Tear down the deployment (asks for confirmation)." },
  { cmd: "nextdeploy inspect", desc: "Inspect the local build artifact and its metadata." },
  { cmd: "nextdeploy secrets", desc: "Manage app secrets — set / list / prune." },
  { cmd: "nextdeploy creds", desc: "Manage cloud credentials — set / list / clear." },
  { cmd: "nextdeploy generate-ci", desc: "Scaffold a GitHub Actions workflow." },
  { cmd: "nextdeploy update", desc: "Self-update the CLI to the latest release." },
  { cmd: "nextdeploy upgrade-daemon", desc: "Upgrade nextdeployd on a connected VPS." },
  { cmd: "nextdeploy version", desc: "Print the CLI version." },
];

const VPS_YAML = `version: "1.0"
target_type: vps

app:
  name: my-next-app
  domain: app.example.com
  port: 3000
  environment: production

servers:
  - name: prod
    host: 1.2.3.4
    username: deploy
    ssh_key: ~/.ssh/id_rsa`;

const AWS_YAML = `version: "1.0"
target_type: serverless

app:
  name: my-next-app
  domain: app.example.com

CloudProvider:
  name: aws

serverless:
  provider: aws
  region: us-east-1   # ACM + CloudFront require us-east-1`;

const CF_YAML = `version: "1.0"
target_type: serverless

app:
  name: my-next-app
  domain: app.example.com

CloudProvider:
  name: cloudflare

serverless:
  provider: cloudflare
  cloudflare:
    compatibility_date: "2025-04-01"
    compatibility_flags:
      - nodejs_compat_v2`;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DocsPage() {
  const release = await getLatestRelease();
  const releaseDate = formatDate(release.date);

  return (
    <div className="prose prose-invert max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white m-0">
          Documentation
        </h1>
        <GitHubStarButton />
      </div>

      <div className="not-prose flex items-start gap-3 p-4 mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="text-emerald-300 font-semibold mb-1">
            Auto-generated overview
          </div>
          <div className="text-emerald-100/80 leading-relaxed">
            Latest release pulled live from{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-200"
            >
              github.com/{REPO}
            </a>{" "}
            at build time. Configuration and CLI surface mirror the engine
            repository. Hand-written guides are in progress — until then, this
            page is enough to ship a Next.js app to any of the three supported
            targets.
          </div>
        </div>
      </div>

      {release.tag && (
        <div className="not-prose mb-10 text-sm">
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-emerald-500/40 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-gray-300">Latest release</span>
            <code className="text-emerald-400 font-mono">{release.tag}</code>
            {releaseDate && (
              <span className="text-gray-500">· {releaseDate}</span>
            )}
          </a>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">Install</h2>
      <p className="text-gray-300 mb-4">
        Single static binary, no Node runtime required.
      </p>
      <CodeBlock code="curl -fsSL https://nextdeploy.org/install.sh | bash" />
      <p className="text-gray-500 text-sm mt-3">
        Windows:{" "}
        <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">
          curl.exe -sSfO https://nextdeploy.org/install.bat &amp;&amp;
          install.bat
        </code>
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">Quickstart</h2>
      <p className="text-gray-300 mb-6">
        Drop one of the snippets below into{" "}
        <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">
          nextdeploy.yml
        </code>{" "}
        at the root of your Next.js project, then run{" "}
        <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">
          nextdeploy ship
        </code>
        .
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">
        VPS — Linux box, deploys over SSH
      </h3>
      <CodeBlock code={VPS_YAML} />
      <p className="text-gray-500 text-sm mt-3">
        First time on a fresh box? Run{" "}
        <code className="text-emerald-400">nextdeploy prepare</code> once to
        install Caddy, nextdeployd, and Fail2Ban.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">
        AWS — Lambda + S3 + CloudFront
      </h3>
      <CodeBlock code={AWS_YAML} />
      <p className="text-gray-500 text-sm mt-3">
        Requires AWS credentials in{" "}
        <code className="text-emerald-400">~/.aws/credentials</code>. Lambda,
        S3, ACM and CloudFront are provisioned on first ship.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">
        Cloudflare — Workers + R2
      </h3>
      <CodeBlock code={CF_YAML} />
      <p className="text-gray-500 text-sm mt-3">
        Requires{" "}
        <code className="text-emerald-400">CLOUDFLARE_API_TOKEN</code> and{" "}
        <code className="text-emerald-400">CLOUDFLARE_ACCOUNT_ID</code>. R2
        credentials are derived from the API token automatically.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">CLI commands</h2>
      <p className="text-gray-300 mb-6">
        Every command supports{" "}
        <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">
          nextdeploy &lt;cmd&gt; explain
        </code>{" "}
        for inline help, and{" "}
        <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">
          --help
        </code>{" "}
        for the flag list.
      </p>
      <div className="not-prose space-y-2">
        {CLI_COMMANDS.map(({ cmd, desc }) => (
          <div
            key={cmd}
            className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6 p-3 bg-slate-900/30 border border-slate-800 rounded-lg"
          >
            <code className="text-emerald-400 font-mono text-sm flex-shrink-0 sm:w-64">
              {cmd}
            </code>
            <span className="text-gray-400 text-sm">{desc}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Configuration reference
      </h2>
      <p className="text-gray-300 mb-4">
        The full schema — every field, its purpose, defaults, and validation
        rules — is annotated in{" "}
        <a
          href={`${REPO_URL}/blob/main/sample.nextdeploy.yml`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          sample.nextdeploy.yml
        </a>
        . That file is the source of truth; this page intentionally does not
        duplicate it.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Where to go next
      </h2>
      <ul className="text-gray-300 space-y-2">
        <li>
          <strong className="text-white">Source &amp; issues:</strong>{" "}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 underline hover:text-emerald-300"
          >
            {REPO_URL.replace("https://", "")}
          </a>
        </li>
        <li>
          <strong className="text-white">Releases:</strong>{" "}
          <a
            href={`${REPO_URL}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 underline hover:text-emerald-300"
          >
            changelog and binaries
          </a>
        </li>
        <li>
          <strong className="text-white">Detailed guides:</strong> being written
          by hand. This page will stay live and in sync with the engine until
          they land.
        </li>
      </ul>
    </div>
  );
}
