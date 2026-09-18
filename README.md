# Seu QR Code

Gerador de QR Codes estáticos que funciona diretamente no navegador. Permite transformar links ou textos em QR Codes, personalizar as cores e exportar o resultado em PNG, sem cadastro, rastreamento ou envio de dados a um servidor.

O repositório também inclui uma versão simples para linha de comando em Python.

## Tecnologias

### Aplicação web

- HTML5 semântico
- CSS3 responsivo, organizado por responsabilidade
- JavaScript moderno com ES Modules
- [QRCode.js](https://github.com/kazuhikoarase/qrcode-generator), incluído localmente em `docs/vendor`
- Canvas API para renderização e exportação do PNG

### Linha de comando

- Python 3.10 ou superior
- uv para gerenciamento do ambiente e das dependências
- Pacote Python `qrcode` com suporte a Pillow

## Requisitos

Para usar a aplicação web, basta um navegador moderno. Para servi-la localmente, é necessário um servidor HTTP simples, como o fornecido pelo Python 3.

Para executar a versão de linha de comando, instale:

- Python 3.10+
- [uv](https://docs.astral.sh/uv/)

## Como rodar o projeto

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/JoaoAnunciacaoDev/GenerateQRCode.git
cd GenerateQRCode
```

### Aplicação web

Inicie um servidor local a partir da raiz do projeto:

```bash
python -m http.server 8000 --directory docs
```

Depois, abra [http://localhost:8000](http://localhost:8000) no navegador.

> A aplicação usa ES Modules; por isso, deve ser aberta por HTTP em vez de executar o arquivo `index.html` diretamente.

### Versão de linha de comando

Instale as dependências:

```bash
uv sync
```

Execute o script:

```bash
uv run python src/generate_qr_code.py
```

Informe o nome e o conteúdo solicitado. O arquivo PNG será salvo no diretório em que o comando foi executado.

## Estrutura do frontend

```text
docs/
├── css/        # estilos base, layout, componentes e responsividade
├── js/         # controlador da tela e módulos utilitários
├── vendor/     # biblioteca QRCode.js e licença
└── index.html  # estrutura semântica da página
```

## Privacidade

O QR Code é gerado inteiramente no navegador. O texto ou link informado não é enviado a nenhum servidor. Como o conteúdo fica gravado no próprio código, o QR Code não expira; no caso de links, apenas a página de destino precisa continuar disponível.
