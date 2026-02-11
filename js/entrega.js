const telefone = "5569999979438";

// 🔥 RECUPERA PEDIDO
const pedido = JSON.parse(localStorage.getItem("pedido"));

if(!pedido){
    alert("Seu carrinho está vazio!");
    window.location.href = "index.html";
}

// 👇 GARANTE NÚMERO
const subtotal = Number(pedido.total) || 0;

let taxaEntrega = 0;


// 🔥 CARREGAR BAIRROS
fetch("bairros.json")
.then(res => res.json())
.then(bairros => {

    const select = document.getElementById("bairro");

    Object.keys(bairros).forEach(nome => {

        select.innerHTML += `
            <option value="${nome}">
                ${nome} - R$ ${bairros[nome].toFixed(2)}
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

    const totalFinal = subtotal + taxaEntrega;

    document.getElementById("totalFinal").innerText =
        "💰 Total: R$ " + totalFinal.toFixed(2);
}


// 🔥 MOSTRAR CAMPO TROCO
const pagamentoSelect = document.getElementById("pagamento");

pagamentoSelect.addEventListener("change", ()=>{

    const trocoBox = document.getElementById("trocoBox");

    trocoBox.style.display =
        pagamentoSelect.value === "Dinheiro"
        ? "flex"
        : "none";
});


// 🚀 ENVIAR WHATS
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

    // 🔥 TRAVAR BOTÃO
    const botao = document.querySelector("button");
    botao.innerText = "Enviando pedido...";
    botao.disabled = true;

    // 🔥 MENSAGEM
    let msg = `
🧾 *PEDIDO ${pedido.id}*
━━━━━━━━━━━━━━━

📅 ${pedido.dia}
🍽️ ${pedido.prato}

${pedido.itens.map(item => 
`✅ ${item.nome} (${item.qtd}x)`
).join("\n")}

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

    window.open(
        `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`,
        "_blank"
    );

    localStorage.removeItem("pedido");
}
