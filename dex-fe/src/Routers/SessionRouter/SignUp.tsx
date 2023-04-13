import { navigate } from "raviger";
import { Auth } from "../../API";
import AuthLayout from "../../Components/Auth/AuthLayout";
import { toast } from "react-hot-toast";
import { login } from "../../hooks/useJWTAuth";
import formData from "../../utils/formData";
import APIErrors from "../../Components/Misc/APIErrors";

interface Form {
  email: string;
  password: string;
}

export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email, password } = formData<Form>(event.currentTarget);

    toast.promise(
      Auth.register({
        username: email,
        email: email,
        password1: password,
        password2: password,
      }).then((response) => {
        if (response.status !== 201) return;
        login(email, password);
      }),
      {
        loading: "Creating account...",
        success: "Account created successfully",
        error: (error) => <APIErrors error={error} />,
      }
    );
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img
            className="h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Accelerate renewable energy adoption
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Exchange energy <a href="#">at the edge</a>
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" />
                <label htmlFor="remember-me" className="ml-2">
                  I agree to the <a href="/swagger">terms of service</a>
                </label>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
