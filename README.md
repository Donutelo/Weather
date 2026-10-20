# Weather

Aplicação web de clima que permite pesquisar uma cidade e consultar suas condições meteorológicas. O projeto combina uma interface em JavaScript e CSS com um servidor Node.js/Express e utiliza serviços externos para localizar cidades e obter dados do clima.

## Funcionalidades

- Busca de cidades com sugestões de localização.
- Exibição de informações meteorológicas, incluindo sensação térmica, umidade e vento.
- Ícones para representar as condições do tempo.
- Layout adaptável para diferentes tamanhos de tela.

## Tecnologias

- JavaScript
- HTML e CSS
- Node.js e Express
- Webpack
- Nominatim para sugestões de localização
- API de clima configurada no projeto

## Como executar

É necessário ter Node.js e npm instalados.

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/Donutelo/Weather.git
   cd Weather

2. Instale as dependências:

    ```bash
    npm install

4. Inicie o projeto com o script de desenvolvimento:

    ```bash
    npm run dev

5. Para gerar a versão de produção:

    ```bash
    npm run build

Estrutura do projeto

    src/ — arquivos da aplicação.
    package.json — dependências e scripts do projeto.
    webpack.*.cjs — configurações do Webpack.
    eslint.config.mjs — configuração do ESLint.

Direitos autorais e uso

Copyright © Donutelo. Todos os direitos reservados.

Este projeto não é distribuído sob uma licença de uso aberto. Nenhuma parte do código ou dos materiais deste repositório pode ser copiada, reproduzida, modificada, distribuída ou reutilizada sem autorização prévia do titular dos direitos autorais.
