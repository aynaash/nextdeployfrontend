// Public route (listed in nextdeploy.yml protection.public_paths).
//
// Your auth UI/logic goes here — NextDeploy doesn't build your app. The edge
// guard only *verifies* a session cookie on protected paths; issuing it (login,
// password/OAuth, the cookie itself) is yours. See README "Protection" for the
// cookie contract the guard checks.
export default function Login() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 48 }}>
      <h1>Sign in</h1>
      <p>Add your login form here.</p>
    </main>
  );
}
