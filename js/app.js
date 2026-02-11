const telefone = "5569999979438";

let almocoHoje;
let total = 0;

function gerarIDPedido(){
    const numero = Math.floor(1000 + Math.random()*9000);
    return "PED-" + numero;
}

// PEGAR DIA FORMATADO
const data = new Date();

const diaFormatado = data.toLocaleDateString('pt-BR',{
    weekday:'long'
});

const diaJSON = diaFormatado
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.replace("-feira","");

// CAPITALIZAR
const diaBonito =
diaFormatado.charAt(0).toUpperCase() +
diaFormatado.slice(1);


// BUSCAR CARDÁPIO
fetch("cardapio.json")
.then(res=>res.json())
.then(data=>{

    almocoHoje = data[diaJSON];

    document.getElementById("titulo").innerHTML =
    `🍽️ ${diaBonito} — Almoço do Dia`;

    document.getElementById("prato").innerHTML = `
        <h2>${almocoHoje.nome}</h2>
        <p>${almocoHoje.descricao}</p>
    `;

    renderTamanhos();
    atualizarTotal(); // inicia zerado na tela
});


// RENDER TAMANHOS
function renderTamanhos(){

    const div = document.getElementById("tamanhos");
    div.innerHTML = "";

    let html = "";

    almocoHoje.tamanhos.forEach((t,i)=>{

        html += `
        <div class="item">
            <div class="item-info">
                <strong>${t.nome}</strong><br>
                <span class="preco">R$ ${t.preco.toFixed(2)}</span>
            </div>

            <div class="contador">
                <button onclick="diminuir(${i})">−</button>
                <span id="qtd-${i}">0</span>
                <button onclick="aumentar(${i})">+</button>
            </div>
        </div>
        `;
    });

    div.innerHTML = html;
}


// CONTADORES
function aumentar(i){

    const el = document.getElementById(`qtd-${i}`);
    let valor = parseInt(el.innerText);

    el.innerText = valor + 1;

    atualizarTotal();
}

function diminuir(i){

    const el = document.getElementById(`qtd-${i}`);
    let valor = parseInt(el.innerText);

    if(valor > 0){
        el.innerText = valor - 1;
    }

    atualizarTotal();
}


// 🔥 CALCULAR TOTAL (FUNÇÃO CORRETA)
function atualizarTotal(){

    total = 0;

    almocoHoje.tamanhos.forEach((t,i)=>{

        const qtd =
        Number(document.getElementById(`qtd-${i}`).innerText);

        total += qtd * Number(t.preco);
    });

    document.getElementById("total")
    .innerText = "Total: R$ " + total.toFixed(2);
}


// IR PARA ENTREGA
function irParaEntrega(){

    atualizarTotal(); // garante valor atualizado

    if(total === 0){
        alert("Selecione pelo menos uma marmita 🙂");
        return;
    }

    const idPedido = gerarIDPedido();

    let pedido = {
        id: idPedido,
        dia: diaBonito,
        prato: almocoHoje.nome,
        itens: [],
        subtotal: Number(total)
    };

    almocoHoje.tamanhos.forEach((t,i)=>{

        const qtd = Number(
            document.getElementById(`qtd-${i}`).innerText);

        if(qtd > 0){
            pedido.itens.push({
                nome: t.nome,
                qtd: qtd,
                preco: t.preco
            });
        }
    });

    localStorage.setItem(
        "pedido",
        JSON.stringify(pedido)
    );

    window.location.href = "entrega.html";
}
