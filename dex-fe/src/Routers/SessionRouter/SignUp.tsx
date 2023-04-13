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
            Exchange energy{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              at the edge
            </a>
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <a
                    href="/swagger"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    terms of service
                  </a>
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
