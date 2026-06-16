import type { Metadata } from "next"
import { DeployTimeline } from "@/components/docs/deploy-timeline"
import { Explainable } from "@/components/docs/explainable"

export const metadata: Metadata = {
  title: "Anatomy of a Deploy | NextDeploy Documentation",
  description:
    "A visual, clickable trace of everything that happens when you run `nextdeploy ship` — from your laptop, through the SSH tunnel, to the VPS.",
}

export default function DeployFlowPage() {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <h1>Anatomy of a Deploy</h1>
      <p className="lead">
        Most tools hide what happens after you hit deploy. NextDeploy invites you to look. Below is the exact path a
        release takes when you run <code>nextdeploy ship</code> — three stages, nine steps, no mystery. Flip{" "}
        <strong>Explain Everything</strong> on (top bar) for the deeper why, or click any step for the code.
      </p>

      <DeployTimeline />

      <Explainable
        summary={
          <p>
            The whole thing rides a <strong>single SSH connection</strong>. No agent, no extra daemon port, no rsync.
          </p>
        }
      >
        <p>
          The upload is literally <code>ssh host &quot;cat &gt; uploads/app.tar.gz&quot;</code> with the tarball piped in
          on stdin, and the deploy is <code>ssh host &quot;nextdeployd ship&quot;</code> on the same channel. The attack
          surface is exactly &quot;can you open an authenticated SSH session&quot; — nothing more. That is why a fresh VPS
          needs zero special setup beyond a user and a key.
        </p>
      </Explainable>

      <h2>Why this shape?</h2>
      <ul>
        <li>
          <strong>Immutable releases.</strong> Every ship lands in its own timestamped directory. Rolling back is just
          re-pointing a symlink at an older one — instant, no rebuild.
        </li>
        <li>
          <strong>Health-gated traffic.</strong> The new release must answer on its private port before the symlink
          flips. A broken build never serves a single request.
        </li>
        <li>
          <strong>Atomic activation.</strong> The cutover is one <code>rename(2)</code>. There is no in-between state
          where <code>current</code> points at a half-extracted release.
        </li>
      </ul>
    </div>
  )
}
