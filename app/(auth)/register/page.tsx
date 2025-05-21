"use client";
import { useState } from "react";
import { authClient } from "../../../auth-client.ts";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/dashboard",
        rememberMe: false
      }, {
        // You can add callbacks here if needed
        onSuccess: () => {
          console.log("Sign in successful");
          setSuccess(true);
        },
        onError: (err) => {
          console.error("Sign in error:", err);
          setError(err.message || "An error occurred during sign in");
        }
      });

      if (authError) {
        throw authError;
      }

      console.log("Sign in successful:", data);
      setSuccess(true);
      // You might want to redirect here or handle the successful sign in
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            Registration successful! Please check your email to verify your account.
          </div>
        )}
        
        <input
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
          minLength="6"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
