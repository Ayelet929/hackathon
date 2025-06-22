import update from './logo.svg';
export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#fceffd", // רקע ורדרד תואם
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px", // גובה בינוני
        margin: "0",
        padding: "0",

      }}
    >
      <img
        src={update}
        alt="update logo"
        style={{
          height: "200px", // גודל לוגו בינוני
          objectFit: "contain",
        }}
      />
    </header>
  );
}
