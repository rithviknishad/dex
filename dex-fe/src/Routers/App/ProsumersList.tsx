import { useState } from "react";
import Modal from "../../Components/Common/Modal";
import formData from "../../utils/formData";
import { toast } from "react-hot-toast";
import { Prosumers } from "../../API";
import APIErrors from "../../Components/Common/APIErrors";
import PaginatedApiTable from "../../Components/Common/PaginatedApiTable";
import { classNames } from "../../utils/classNames";
import { navigate } from "raviger";
import { Prosumer } from "../../API/models/DEX";

const Table = PaginatedApiTable<Prosumer>;

interface CreateProsumerForm {
  name: string;
  description: string;
  location__latitude: number;
  location__longitude: number;
}

export default function ProsumersList() {
  const [showCreate, setShowCreate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegisterProsumer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = formData<CreateProsumerForm>(event.currentTarget);
    toast.promise(
      Prosumers.create({
        name: form.name,
        description: form.description,
        location: {
          latitude: form.location__latitude,
          longitude: form.location__longitude,
        },
      }).then((res) => {
        if (res.status === 201) {
          setShowCreate(false);
          setRefreshKey((key) => key + 1);
        }
        return res;
      }),
      {
        loading: "Registering...",
        success: (res) => (
          <span>
            <p>{res.data.name} registered!</p>
            <p className="text-xs text-gray-400 font-bold font-mono">
              ID: {res.data.id}
            </p>
          </span>
        ),
        error: (error) => <APIErrors error={error} />,
      }
    );
  };

  return (
    <div className="p-4">
      <Modal
        opened={showCreate}
        onClose={() => setShowCreate(false)}
        title="Register a new prosumer"
      >
        <form onSubmit={handleRegisterProsumer}>
          <div>
            <label htmlFor="name" className="required">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="E.g. 'My Home'"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label htmlFor="location__latitude" className="required">
                Latitude
              </label>
              <input
                id="location__latitude"
                name="location__latitude"
                type="number"
                step="any"
                autoComplete="location__latitude"
                required
                min={-90}
                max={90}
                placeholder="E.g. '37.7749'"
              />
            </div>
            <div>
              <label htmlFor="location__longitude" className="required">
                Longitude
              </label>
              <input
                id="location__longitude"
                name="location__longitude"
                type="number"
                step="any"
                autoComplete="location__longitude"
                required
                min={-180}
                max={180}
                placeholder="E.g. '-122.4194'"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              autoComplete="description"
              placeholder="Optional. E.g. 'My home in San Francisco, CA.'"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowCreate(false)}>
              Cancel
            </button>
            <button type="submit">Register</button>
          </div>
        </form>
      </Modal>
      <div className="px-4 py-8 bg-white rounded-lg">
        <Table
          key={refreshKey}
          onQuery={(limit, offset) => {
            setIsRefreshing(true);
            return Prosumers.list({ query: { limit, offset } }).then((res) => {
              setIsRefreshing(false);
              return res;
            });
          }}
          title="Prosumers"
          description="List of all prosumers managed by your billing account."
          theads={{
            id: "Prosumer#",
            name: "Name",
            description: "Description",
            location: "Location",
            updated_on: "Modified",
          }}
          render={{
            id: ({ id }) => (
              <span className="font-mono font-bold text-gray-500">
                {id.toString().slice(-6)}
              </span>
            ),
            location: ({ location: loc }) => (
              <>
                {loc.latitude}, {loc.longitude}
              </>
            ),
          }}
          tableActions={[
            <button type="button" onClick={() => setShowCreate(true)}>
              <i className="fa-solid fa-plus" />
              Register
            </button>,
            <button
              disabled={isRefreshing}
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className={isRefreshing ? "animate-pulse" : ""}
            >
              <i
                className={classNames(
                  "fa-solid fa-rotate",
                  isRefreshing && "animate-spin"
                )}
              />
              Refresh
            </button>,
          ]}
          onClickRow={(prosumer) => navigate("/prosumers/" + prosumer.id)}
        />
      </div>
    </div>
  );
}
