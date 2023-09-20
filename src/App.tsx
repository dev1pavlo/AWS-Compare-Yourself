import { Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { API_URL } from "./constants";
import axios from "axios";

interface ICompareData {
  age: number;
  height: number;
  income: number;
}

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [compareData, setCompareData] = useState<ICompareData[]>([]);
  const [personalData, setPersonalData] = useState<ICompareData | null>(null);

  async function refetchData(authToken?: string) {
    const { data } = await axios.get<ICompareData[]>(`${API_URL}/all`, {
      headers: {
        authorization: authToken || token,
      },
      method: "GET",
    });
    setCompareData(data);
  }

  async function refetchPersonalData(authToken?: string) {
    const { data } = await axios.get<ICompareData>(`${API_URL}/single`, {
      headers: {
        authorization: authToken || token,
      },
      method: "GET",
    });
    setPersonalData(data);
  }

  async function onDelete() {
    await axios.delete(API_URL, {
      headers: {
        authorization: token,
      },
    });

    await refetchData();
    await refetchPersonalData();
  }

  useEffect(() => {
    async function getToken() {
      try {
        const session = await Auth.currentSession();

        if (session) {
          const authToken = session.getIdToken().getJwtToken();

          setToken(authToken);
        }
      } catch (e) {}
    }

    getToken();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        await refetchData();
        await refetchPersonalData();
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [token, userId]);

  async function addCompareData(e: SyntheticEvent) {
    e.preventDefault();
    const data = {
      age: Number.parseInt(age),
      height: Number.parseInt(height),
      income: Number.parseInt(income),
    };
    await axios.post(API_URL, data, {
      headers: {
        authorization: token,
      },
    });
    await refetchData();
    await refetchPersonalData();
  }

  return (
    <Authenticator
      formFields={{
        signUp: {
          email: {
            label: "Email",
            order: 1,
            isRequired: true,
            placeholder: "Enter email...",
          },
        },
      }}
    >
      {({ signOut, user }) => {
        user?.getUserAttributes((err, data) => {
          if (!data) return;
          const id = data.find((d) => d.Name === "sub");
          setUserId(id?.Value || "");
        });
        if (!token) return <div>Loading..</div>;

        return (
          <div>
            <hr />
            <p>Sign out section</p>
            <button
              onClick={(data: any) => {
                signOut?.(data);
                setUserId(null);
              }}
            >
              Sign out
            </button>
            <hr />
            <br />
            <hr />
            <p>Your personal data (that you added)</p>
            {personalData ? (
              <div>
                Age: {personalData.age} <br />
                Height: {personalData.height} <br />
                Income: {personalData.income} <br />
              </div>
            ) : (
              <p>No personal data for now</p>
            )}
            <br />
            <br />
            {personalData && (
              <button onClick={onDelete}>Delete your personal data</button>
            )}
            <hr />
            <br />
            <hr />
            <p>Add your compare data!</p>
            <form onSubmit={addCompareData}>
              <label htmlFor="age">Age</label>
              <br />
              <input
                name="age"
                placeholder="Enter age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
              <br />
              <label htmlFor="height">Height</label>
              <br />
              <input
                name="height"
                placeholder="Enter height"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                }}
              />
              <br />
              <label htmlFor="income">Income</label>
              <br />
              <input
                name="income"
                placeholder="Enter income"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value);
                }}
              />
              <br />
              <button type="submit">Add</button>
            </form>
            <hr />
            <br />
            <hr />
            <p>Global compare data: </p>
            <table border={1}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Age</th>
                  <th>Height</th>
                  <th>Income</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map((c, i) => (
                  <tr
                    key={i}
                    style={{
                      padding: 5,
                    }}
                  >
                    <th>{i + 1}</th>
                    <th>{c.age}</th>
                    <th>{c.height}</th>
                    <th>{c.income}</th>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
          </div>
        );
      }}
    </Authenticator>
  );
}

export default App;
