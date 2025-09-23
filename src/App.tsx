import React, { useState } from "react";
import Header from "./components/Header";
import Image from "./components/Image";
import MenuCategoria from "./components/MenuCategoria"; 
import CategoriasHome from "./components/CategoriasHome.tsx";

// Componente App separado
function App() {
    return (
        <div className="App">
            <Header />
            <MenuCategoria />
            <Image />
            <CategoriasHome />
        </div>
    );
}

export default App;