const telefone = "5569999979438";

let pedido;

try{
    pedido = JSON.parse(localStorage.getItem("pedido"));
}catch{
    pedido = null;
}

if(!pedido || !pedido.itens || pedido.itens.length === 0){
    alert("Seu carrinho está vazio!");
    window.location.href = "index.html";
}

// 🔥 garante que o total sempre exista
pedido.total = Number(
    pedido.total ?? pedido.subtotal ?? 0
);


// Compatível com versões antigas
const subtotal = Number(
    pedido.total ?? pedido.subtotal
) || 0;

let taxaEntrega = 0;


// BAIRROS
fetch("bairros.json")
.then(res => res.json())
.then(bairros => {

    const select = document.getElementById("bairro");

    Object.keys(bairros).forEach(nome => {

        select.innerHTML += `
            <option value="${nome}">
                ${nome}
            </option>`;
    });

    taxaEntrega = Number(bairros[select.value]) || 0;

    atualizarTaxa();
    calcularTotalFinal();

    select.addEventListener("change", () => {

        taxaEntrega = Number(bairros[select.value]) || 0;

        atualizarTaxa();
        calcularTotalFinal();
    });

});

function atualizarTaxa(){
    document.getElementById("taxa").innerText =
        "🚚 Taxa de entrega: R$ " + taxaEntrega.toFixed(2);
}

function calcularTotalFinal(){

    const totalFinal = Number(subtotal) + Number(taxaEntrega);

    document.getElementById("totalFinal").innerText =
        "💰 Total: R$ " + totalFinal.toFixed(2);
}


// TROCO
const pagamentoSelect = document.getElementById("pagamento");

pagamentoSelect.addEventListener("change", ()=>{

    document.getElementById("trocoBox").style.display =
        pagamentoSelect.value === "Dinheiro"
        ? "flex"
        : "none";
});


// WHATS
function enviarWhats(){

    const nome = document.getElementById("nome").value.trim();
    const bairro = document.getElementById("bairro").value;
    const rua = document.getElementById("rua").value.trim();
    const pagamento = document.getElementById("pagamento").value;
    const troco = document.getElementById("troco").value;

    if(nome.length < 3){
        alert("Digite seu nome 🙂");
        return;
    }

    if(!rua){
        alert("Digite seu endereço 🙂");
        return;
    }

    const totalFinal = subtotal + taxaEntrega;

    if(pagamento === "Dinheiro" && troco){
        if(Number(troco) < totalFinal){
            alert("O troco precisa ser maior que o valor do pedido 🙂");
            return;
        }
    }

    const botao = document.querySelector("button[onclick='enviarWhats()']");
    botao.innerText = "Enviando pedido...";
    botao.disabled = true;

    let msg = `
🧾 *PEDIDO ${pedido.id}*
━━━━━━━━━━━━━━━

📅 ${pedido.dia}
🍽️ *${pedido.prato}*

📦 *Itens*
${pedido.itens.map(item => 
`✅ ${item.nome} (${item.qtd}x)`
).join("\n")}

${pedido.bebidas && pedido.bebidas.length > 0 ? `
🥤 *Bebidas*
${pedido.bebidas.map(b => 
`✅ ${b.nome} (${b.qtd}x)`
).join("\n")}
` : ""}
━━━━━━━━━━━━━━━
👤 Cliente: ${nome}
🚚 Bairro: ${bairro}
📍 Endereço: ${rua}
💳 Pagamento: ${pagamento}
${pagamento === "Dinheiro" && troco ? `💵 Troco para: R$ ${troco}` : ""}
━━━━━━━━━━━━━━━
🧾 Subtotal: R$ ${subtotal.toFixed(2)}
🚚 Entrega: R$ ${taxaEntrega.toFixed(2)}
💰 *TOTAL: R$ ${totalFinal.toFixed(2)}*
`;

    // 🔥 AQUI estava faltando!
    window.open(
        `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`,
        "_blank"
    );

    // limpa carrinho
    localStorage.removeItem("pedido");
}
