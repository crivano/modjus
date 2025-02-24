// app/page.js
'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Fazendo a requisição para a API que irá registrar o log no servidor
    fetch('/api/log')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.error('Erro ao chamar a API', err));
  }, []);

  return (
    <div>
      Bem-vindo ao Modjus!
    </div>
  );
}
