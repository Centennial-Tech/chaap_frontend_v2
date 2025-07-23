import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Loader2 } from "lucide-react";
import api from "../api";
import TermsModal from "../components/TermsModal";

interface SignupFormData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmPassword: string;
  date_of_birth?: string;
  phone_number?: string;
  organization_name?: string;
  acceptTerms: boolean;
}

const Signup = () => {
  const logo = new URL("../assets/logo.svg", import.meta.url).href;
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    phone_number: "",
    organization_name: "",
    acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.first_name || !formData.last_name || 
        !formData.username || !formData.password || !formData.confirmPassword) {
      return "All required fields must be filled out";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (!formData.acceptTerms) {
      return "You must accept the terms and conditions to continue";
    }

    return null;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...signupData } = formData;
      
      // Remove empty optional fields
      const cleanData = Object.fromEntries(
        Object.entries(signupData).filter(([_, value]) => value !== "")
      );

      await api.post("/auth/register", cleanData);
      
      // Redirect to login page with success message
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." }
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "An error occurred during signup. Please try again.";
      setError(errorMessage);
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start your 14-day free trial today
        </p>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm/6 font-medium text-gray-600"
              >
                First Name *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm/6 font-medium text-gray-600"
              >
                Last Name *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Email Address *
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Username *
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label
              htmlFor="organization_name"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Organization Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="organization_name"
                id="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                autoComplete="organization"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                autoComplete="tel"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Date of Birth
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Password *
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                minLength={8}
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-600"
            >
              Confirm Password *
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
              />
            </div>
          </div>

                     {/* Terms and Conditions */}
           <div className="flex items-start">
             <div className="flex items-center h-5">
               <input
                 id="acceptTerms"
                 name="acceptTerms"
                 type="checkbox"
                 checked={formData.acceptTerms}
                 onChange={handleInputChange}
                 className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
               />
             </div>
             <div className="ml-3 text-sm">
               <label htmlFor="acceptTerms" className="text-gray-600">
                 I have read and accepted the{" "}
                 <button
                   type="button"
                   onClick={() => setIsTermsModalOpen(true)}
                   className="font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200 underline"
                 >
                   Terms and Conditions
                 </button>
               </label>
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
                   Creating account...
                 </>
               ) : (
                 "Create account"
               )}
             </Button>
           </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200"
          >
            Sign in here
          </Link>
                 </p>
       </div>

       {/* Terms Modal */}
       <TermsModal 
         isOpen={isTermsModalOpen} 
         onClose={() => setIsTermsModalOpen(false)} 
       />
     </div>
   );
 };

export default Signup;