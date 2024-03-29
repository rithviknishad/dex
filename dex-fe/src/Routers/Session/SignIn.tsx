import { Link } from "raviger";
import AuthLayout from "../../Components/Auth/AuthLayout";
import formData from "../../utils/formData";
import { Auth } from "../../API";
import { toast } from "react-hot-toast";
import { login } from "../../hooks/useJWTAuth";
import APIErrors from "../../Components/Common/APIErrors";

interface Form {
  email: string;
  password: string;
}

export default function SignIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email, password } = formData<Form>(event.currentTarget);

    toast.promise(
      Auth.tokenCreate(email, password).then((response) => {
        if (response.status !== 200) return;
        login(email, password);
      }),
      {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (error) => <APIErrors error={error} />,
      }
    );
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            using your registered <a href="#">billing account</a>
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" />
                <label htmlFor="remember-me" className="ml-2">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/onboard">New to DEX? Sign up</Link>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
