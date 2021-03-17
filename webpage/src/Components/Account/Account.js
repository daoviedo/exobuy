import React from "react";
import axios from "axios";

export default function Account() {
  const [accInfo, setAccinfo] = React.useState({});
  const [munList, setmunList] = React.useState([]);
  const [ciudList, setciudList] = React.useState([]);
  const [paises, setpaises] = React.useState([]);
  const [prov, setprov] = React.useState([]);
  React.useEffect(() => {
    //api call to get acc info
    axios
      .get("https://api.dev.myexobuy.com/account/info", {
        headers: {
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      })
      .then((result) => setAccinfo(result.data.info));
    //api call to get municipios
    axios
      .get("https://api.dev.myexobuy.com/area/municipios")
      .then((result) => setmunList(result.data.data));
    //api call to get ciudades
    axios
      .get("https://api.dev.myexobuy.com/area/ciudades")
      .then((result) => setciudList(result.data.data));
    //api call to get paises
    axios
      .get("https://api.dev.myexobuy.com/area/paises")
      .then((result) => setpaises(result.data.data));
    //api call to get provincias
    axios
      .get("https://api.dev.myexobuy.com/area/provincias")
      .then((result) => setprov(result.data.data));
  }, []);

  return (
    <React.Fragment>
      <div style={{ marginTop: 60 }}>
        <label htmlFor="fname">Nombre 1:</label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={accInfo.NOMBRE_01_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="fname2">Nombre 2:</label>
        <input
          type="text"
          id="fname2"
          name="fname2"
          value={accInfo.NOMBRE_02_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="lname">Apellido 1:</label>
        <input
          type="text"
          id="lname"
          name="lname"
          value={accInfo.APELLIDO_01_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="lname2">Apellido 2:</label>
        <input
          type="text"
          id="lname2"
          name="lname2"
          value={accInfo.APELLIDO_02_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="fechanac">Fecha de nacimiento:</label>
        <input
          type="date"
          id="fechanac"
          name="fechanac"
          value={String(accInfo.FECHA_NAC_USUARIO).split("T",1)}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="tipoid">Tipo identidad:</label>
        <select
          type="text"
          id="tipoid"
          name="tipoid"
          value={accInfo.COD_PAIS}
          onChange={(event) => {}}
        >
          <option value={1}>Cédula de Identidad</option>
          <option value={2}>Pasaporte</option>
          ))
        </select>
        <br />
        <label htmlFor="idnum">Numero identidad:</label>
        <input
          type="text"
          id="idnum"
          name="idnum"
          value={accInfo.ID_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={accInfo.EMAIL_USUARIO}
          onChange={(event) => {}}
        ></input>
        <br />
        <label htmlFor="pais">Pais:</label>
        <select
          type="text"
          id="pais"
          name="pais"
          value={accInfo.COD_PAIS}
          onChange={(event) => {}}
        >
          {paises.map((city) => (
            <option key={city.COD_PAIS} value={city.COD_PAIS}>
              {city.PAIS}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="provincia">Provincia:</label>
        <select
          type="text"
          id="provincia"
          name="provincia"
          value={accInfo.COD_PROVINCIA}
          onChange={(event) => {}}
        >
          {prov.map((provitem) => (
            <option key={provitem.COD_PROVINCIA} value={provitem.COD_PROVINCIA}>
              {provitem.PROVINCIA}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="municipio">Municipio:</label>
        <select
          type="text"
          id="municipio"
          name="municipio"
          value={accInfo.COD_MUNICIPIO}
          onChange={(event) => {}}
        >
          {munList.map((mun) => (
            <option key={mun.COD_MUNICIPIO} value={mun.COD_MUNICIPIO}>
              {mun.MUNICIPIO}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="ciudad">Ciudad:</label>
        <select
          type="select"
          id="ciudad"
          name="ciudad"
          value={accInfo.COD_CIUDAD}
          onChange={(event) => {}}
        >
          {ciudList.map((ciud) => (
            <option key={ciud.COD_CIUDAD} value={ciud.COD_CIUDAD}>
              {ciud.CIUDAD}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="direccion">Direccion:</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={accInfo.DIRECCION_FISICA}
          onChange={(event) => {}}
        ></input>
        <br />
        <button
          onClick={() => (window.location.href = "/terms")}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Términos y condiciones
        </button>
      </div>
    </React.Fragment>
  );
}
