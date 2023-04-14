import { Model } from "../../API/models";
import { Prosumer } from "../../API/models/Prosumers";
import Table from "../../Components/Common/Table";

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

export default function ProsumersList() {
  return (
    <div className="p-4">
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
            <button type="button">Add</button>,
            <button type="button">Refresh</button>,
          ]}
        />
      </div>
    </div>
  );
}
