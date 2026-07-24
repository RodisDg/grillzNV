/* =========================================================
   grillzNV — script.js
   Vanilla JS: renderização de produtos, carrinho e navegação
   ========================================================= */

/* -----------------------------------------------------------
   1. DADOS DOS PRODUTOS
   Em um projeto real esses dados viriam de uma API/banco de
   dados. Aqui simulamos isso com um array de objetos: cada
   objeto é um produto, com os campos que vamos usar para
   montar o HTML dos cards mais abaixo.
----------------------------------------------------------- */
const produtos = [
  {
    id: 1,
    nome: "Grillz Ouro Maciço 18k",
    categoria: "Ouro 18k",
    descricao: "Peça única em ouro amarelo 18k, polimento espelhado, molde individual.",
    preco: 1890.0,
    badge: "18K",
    // foto: grillz de ouro em uso (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1512159986660-a677c02d43a7?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    nome: "Grillz Cravejado VVS",
    categoria: "Ouro branco + diamante",
    descricao: "Cravação full diamond VVS sobre base de ouro branco 18k. Máximo brilho.",
    preco: 4590.0,
    badge: "VVS",
    // foto: sorriso mostrando grillz dourado (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1751575032820-f7db0b4f4ad3?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    nome: "Grillz Prata Rhodium Fang",
    categoria: "Prata 950",
    descricao: "Design 'presa' em prata 950 com banho de ródio, acabamento fosco.",
    preco: 690.0,
    badge: "PRATA",
    // foto: grillz em destaque, pose de perto (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1509581326627-b69287adfeb8?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    nome: "Grillz Ouro Rosé Duplo",
    categoria: "Ouro rosé 18k",
    descricao: "Kit arcada superior + inferior em ouro rosé 18k. Vem com case de veludo.",
    preco: 2750.0,
    badge: "DUPLO",
    // foto: grillz dourado em uso (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1760724820412-0dfd70dab608?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    nome: "Grillz Iced Full Mouth",
    categoria: "Ouro 18k + diamante",
    descricao: "Cobertura total (10 a 10), cravação diamante VVS em ouro 18k. Peça statement.",
    preco: 8900.0,
    badge: "ICED",
    // foto: grillz dourado + correntes, visual "iced out" (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1767570867725-8e172fe718bf?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    nome: "Grillz Prata com Zircônia",
    categoria: "Prata 950 + zircônia",
    descricao: "Cravação em zircônia sobre prata 950. Ótimo custo-benefício para começar.",
    preco: 990.0,
    badge: "ZIRCÔNIA",
    // foto: grillz em uso, sorriso aberto (licença livre Unsplash)
    imagem: "https://images.unsplash.com/photo-1774029539545-c2f479d869f6?fm=jpg&q=80&w=800&auto=format&fit=crop"
  }
];

/* Carrinho: começa vazio. Cada item terá o formato
   { produto: {...}, quantidade: n }                          */
let carrinho = [];

/* -----------------------------------------------------------
   2. REFERÊNCIAS DO DOM
   Guardamos os elementos que vamos manipular várias vezes
   em variáveis, para não ficar chamando document.querySelector
   repetidamente.
----------------------------------------------------------- */
const vitrineEl = document.getElementById("vitrine-produtos");
const carrinhoContainerEl = document.getElementById("carrinho-container");
const cartBadgeEl = document.getElementById("cart-badge");
const secoes = document.querySelectorAll(".section");
const linksNav = document.querySelectorAll("[data-nav-link]");

/* -----------------------------------------------------------
   3. FORMATAÇÃO DE PREÇO EM REAIS
   Usamos a API nativa Intl.NumberFormat do JavaScript para
   converter um número (ex: 1890) em "R$ 1.890,00", já no
   padrão brasileiro. Evita concatenar strings manualmente.
----------------------------------------------------------- */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* -----------------------------------------------------------
   4. RENDERIZAÇÃO DA VITRINE DE PRODUTOS
   Percorremos o array "produtos" com .map() e, para cada
   produto, geramos o HTML do card usando template literals
   (as crases ``). No final juntamos tudo em uma única string
   e inserimos de uma vez no container com innerHTML — isso é
   mais performático do que inserir card por card no DOM.
----------------------------------------------------------- */
function renderizarProdutos() {
  const html = produtos
    .map((produto) => {
      return `
        <article class="card">
          <span class="card__badge">${produto.badge}</span>
          <div class="card__img-wrapper">
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
          </div>
          <div class="card__body">
            <span class="card__categoria">${produto.categoria}</span>
            <h3 class="card__nome">${produto.nome}</h3>
            <p class="card__descricao">${produto.descricao}</p>
            <span class="card__preco">${formatarPreco(produto.preco)}</span>
            <button class="btn btn--card" data-add-produto="${produto.id}">
              Adicionar ao carrinho
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  vitrineEl.innerHTML = html;
}

/* -----------------------------------------------------------
   5. LÓGICA DO CARRINHO
----------------------------------------------------------- */

// Adiciona um produto ao carrinho (ou aumenta a quantidade se já existir)
function adicionarAoCarrinho(idProduto) {
  const produto = produtos.find((p) => p.id === idProduto);
  if (!produto) return;

  const itemExistente = carrinho.find((item) => item.produto.id === idProduto);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ produto, quantidade: 1 });
  }

  atualizarCarrinho();
}

// Remove um item inteiro do carrinho, independente da quantidade
function removerDoCarrinho(idProduto) {
  carrinho = carrinho.filter((item) => item.produto.id !== idProduto);
  atualizarCarrinho();
}

// Altera a quantidade de um item (usado pelos botões +/-)
function alterarQuantidade(idProduto, delta) {
  const item = carrinho.find((item) => item.produto.id === idProduto);
  if (!item) return;

  item.quantidade += delta;

  // se a quantidade zerar, o item sai do carrinho
  if (item.quantidade <= 0) {
    removerDoCarrinho(idProduto);
    return;
  }

  atualizarCarrinho();
}

// Recalcula o total somando (preço x quantidade) de cada item
function calcularTotal() {
  return carrinho.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
}

// Atualiza o número que aparece no ícone do carrinho no header
function atualizarBadge() {
  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  cartBadgeEl.textContent = totalItens;
}

/* Renderiza o conteúdo da seção "Carrinho" do zero, a cada mudança.
   É uma abordagem simples (re-renderizar tudo) que funciona muito
   bem para carrinhos pequenos como este e mantém a lógica fácil
   de entender e explicar. */
function renderizarCarrinho() {
  if (carrinho.length === 0) {
    carrinhoContainerEl.innerHTML = `
      <div class="carrinho-vazio">
        <p>Seu carrinho está vazio. Volte para a vitrine e escolha seu grillz. 💎</p>
      </div>
    `;
    return;
  }

  const itensHtml = carrinho
    .map((item) => {
      const subtotal = item.produto.preco * item.quantidade;
      return `
        <div class="carrinho-item">
          <div class="carrinho-item__img">
            <img src="${item.produto.imagem}" alt="${item.produto.nome}">
          </div>
          <div class="carrinho-item__info">
            <p class="carrinho-item__nome">${item.produto.nome}</p>
            <p class="carrinho-item__preco">${formatarPreco(subtotal)}</p>
          </div>
          <div class="carrinho-item__acoes">
            <div class="carrinho-item__qtd">
              <button class="btn--icon" data-diminuir="${item.produto.id}" aria-label="Diminuir quantidade">−</button>
              <span>${item.quantidade}</span>
              <button class="btn--icon" data-aumentar="${item.produto.id}" aria-label="Aumentar quantidade">+</button>
            </div>
            <button class="btn--remover" data-remover="${item.produto.id}">Remover</button>
          </div>
        </div>
      `;
    })
    .join("");

  carrinhoContainerEl.innerHTML = `
    ${itensHtml}
    <div class="carrinho-resumo">
      <span>Total</span>
      <span class="carrinho-resumo__total">${formatarPreco(calcularTotal())}</span>
    </div>
  `;
}

// Função "mestre" chamada sempre que o carrinho muda: mantém tudo em sincronia
function atualizarCarrinho() {
  atualizarBadge();
  renderizarCarrinho();
}

/* -----------------------------------------------------------
   6. NAVEGAÇÃO ENTRE SEÇÕES (Início / Carrinho / Sobre)
   Em vez de usar várias páginas HTML, simulamos a navegação
   de uma SPA (Single Page Application) simples: todas as
   seções já existem no HTML, e o JS apenas troca a classe
   "is-active" entre elas. O CSS cuida da transição de fade
   (ver a animação @keyframes fadeIn em style.css).
----------------------------------------------------------- */
function mostrarSecao(idSecao) {
  secoes.forEach((secao) => {
    secao.classList.toggle("is-active", secao.id === idSecao);
  });

  // também atualiza qual link do menu fica destacado
  linksNav.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.target === idSecao);
  });

  // sobe a página para o topo ao trocar de seção
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* -----------------------------------------------------------
   7. EVENT LISTENERS (delegação de eventos)
   Em vez de adicionar um "addEventListener" em cada botão
   individualmente (o que seria inviável, já que os cards são
   criados dinamicamente), escutamos os cliques no container
   pai e verificamos QUAL elemento foi clicado através dos
   atributos data-*. Isso é chamado de "delegação de eventos".
----------------------------------------------------------- */

// Cliques dentro da vitrine (botão "Adicionar ao carrinho")
vitrineEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-add-produto]");
  if (!botao) return;

  const idProduto = Number(botao.dataset.addProduto);
  adicionarAoCarrinho(idProduto);
});

// Cliques dentro do carrinho (aumentar, diminuir, remover)
carrinhoContainerEl.addEventListener("click", (evento) => {
  const btnAumentar = evento.target.closest("[data-aumentar]");
  const btnDiminuir = evento.target.closest("[data-diminuir]");
  const btnRemover = evento.target.closest("[data-remover]");

  if (btnAumentar) {
    alterarQuantidade(Number(btnAumentar.dataset.aumentar), 1);
  } else if (btnDiminuir) {
    alterarQuantidade(Number(btnDiminuir.dataset.diminuir), -1);
  } else if (btnRemover) {
    removerDoCarrinho(Number(btnRemover.dataset.remover));
  }
});

// Cliques nos links de navegação (header)
linksNav.forEach((link) => {
  link.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarSecao(link.dataset.target);
  });
});

/* -----------------------------------------------------------
   8. INICIALIZAÇÃO
   Assim que o script carrega, renderizamos a vitrine e
   deixamos o carrinho e o badge já no estado correto (vazio).
----------------------------------------------------------- */
renderizarProdutos();
atualizarCarrinho();