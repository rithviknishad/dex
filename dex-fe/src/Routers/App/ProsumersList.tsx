import { useState } from "react";
import { Model } from "../../API/models";
import { Prosumer } from "../../API/models/Prosumers";
import Modal from "../../Components/Common/Modal";
import Table from "../../Components/Common/Table";
import formData from "../../utils/formData";
import { toast } from "react-hot-toast";
import { Prosumers } from "../../API";
import APIErrors from "../../Components/Common/APIErrors";

const prosumer: Model<Prosumer> = {
  id: 1,
  billing_account: 1,
  name: "Prosumer 1",
  description: "Prosumer 1",
  location: { latitude: 0, longitude: 0 },
  updated_on: new Date().toISOString(),
  created_on: new Date().toISOString(),
};

const prosumers = Array.from({ length: 10 }, (_, i) => prosumer);

interface CreateProsumerForm {
  name: string;
  description: string;
  location__latitude: number;
  location__longitude: number;
}

export default function ProsumersList() {
  const [showCreate, setShowCreate] = useState(false);

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
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Something you would uniquely identify. E.g. 'My Home'"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label htmlFor="location__latitude">Latitude</label>
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
              <label htmlFor="location__longitude">Longitude</label>
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
          title="Prosumers"
          description="List of all prosumers managed by your billing account."
          theads={{
            id: "ID",
            name: "Name",
            description: "Description",
            billing_account: "Billing Account",
            location: "Location",
            updated_on: "Updated On",
            created_on: "Created On",
          }}
          content={prosumers}
          primaryKey="name"
          render={{
            location: (location: any) => (
              <span>
                {location.latitude}, {location.longitude}
              </span>
            ),
          }}
          tableActions={[
            <button type="button" onClick={() => setShowCreate(true)}>
              <i className="fa-solid fa-plus" />
              Register
            </button>,
            <button type="button">Refresh</button>,
          ]}
        />
      </div>
    </div>
  );
}
