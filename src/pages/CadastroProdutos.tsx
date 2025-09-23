import React, { useState } from "react";

export default function CadastroProduto(){
    const [form, setForm] = useState({
        nome: "",
        quantidade: "",
        categoria: "",
        preco: "",
        validade: "",
        imagem: null;
    });
};

const 