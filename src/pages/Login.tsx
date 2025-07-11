import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider"; // update path if needed
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Loader2 } from "lucide-react";

const Login = () => {
  const logo = new URL("../assets/logo.svg", import.meta.url).href;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const identifier = form.get("identifier")?.toString() ?? "";
    const password = form.get("password")?.toString() ?? "";

    try {
      await login({username: identifier, password: password});
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or server error.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to="/" className="flex justify-center items-center">
          <img className="mx-auto h-14 w-auto" src={logo} alt="Your Company" />
        </Link>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Username or Email
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="identifier"
                id="identifier"
                required
                autoFocus
                autoComplete="identifier"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-600"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                required
                autoComplete="current-password"
                className="block border w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200"
          >
            Sign up with a 14 day free trial
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
