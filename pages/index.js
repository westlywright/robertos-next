import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useQuery, gql } from "@apollo/client";
import Table from "../components/common/table/index";

const ENTRIES = gql`
  query getEntries {
    entries {
      date
      ingredient
      count
      quality
      verify
      vendor {
        name
      }
    }
  }
`;

const PRODUCT_HEADERS = [
  {
    label: "Date",
    field: "date",
    formatter: "date",
  },
  {
    label: "Vendor",
    field: "vendor.name",
  },
  {
    label: "Ingredient",
    field: "ingredient",
    formatter: "startCase",
  },
  {
    label: "Quality",
    field: "quality",
  },
  {
    label: "Total",
    field: "count",
  },
  {
    label: "Actions",
    field: "verify",
    formatter: (action) => {
      if (action) {
        return (<button type="button" onClick={() => alert('Verified, you may now close this message.')}>Verify</button>);
      } else {
        return (<button type="button" disabled>Confirmed</button>);
      }
    },
  },
];

export default function Home() {
  const { loading, error, data } = useQuery(ENTRIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Robertos</title>
        <meta name="description" content="Robertos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Robertos Dashboard</h1>

        <Table
          entries={data.entries}
          headers={PRODUCT_HEADERS}
          groupBy="ingredient"
          defaultSort="date"
          defaultSortDirection="descending"
        />
      </main>
    </div>
  );
}
