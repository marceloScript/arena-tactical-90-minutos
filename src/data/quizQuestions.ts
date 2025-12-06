// src/data/quizQuestions.ts
import { Question, QuizCategory, Difficulty } from '@/types/quiz'

export const quizQuestions: Question[] = [
  // === REGULAMENTO FIFA (5 questões) ===
  {
    id: 'fifa-1',
    question: 'De acordo com o Regulamento sobre o Status e a Transferência de Jogadores (RSTP) da FIFA, em quais circunstâncias se torna devida a Compensação por Formação?',
    options: [
      'Em toda transferência de um profissional, independentemente da idade',
      'Apenas quando o jogador assina seu primeiro contrato profissional ou é transferido internacionalmente até o final da temporada do seu 23º aniversário',
      'Em transferências nacionais ou internacionais, somente se o atleta tiver entre 12 e 23 anos',
      'Em todas as transferências internacionais de jogadores, de 12 até o final da carreira',
      'Quando o clube encerra o contrato do jogador sem justa causa'
    ],
    correctAnswer: 1,
    category: 'regulamento_fifa',
    difficulty: 'dificil',
    explanation: 'A Compensação por Formação é devida quando um jogador assina seu primeiro contrato profissional ou é transferido internacionalmente até o final da temporada do seu 23º aniversário, conforme Artigo 20 do RSTP.'
  },
  {
    id: 'fifa-2',
    question: 'O Regulamento de Agentes de Futebol da FIFA (FFAR) estabelece limites máximos de comissão. Qual o limite quando o Agente atua em nome do clube vendedor?',
    options: [
      '10% da compensação de transferência',
      '5% da compensação de transferência', 
      '3% da compensação de transferência',
      '10% da remuneração do atleta',
      'Não há limite para o clube vendedor'
    ],
    correctAnswer: 2,
    category: 'regulamento_fifa',
    difficulty: 'medio',
    explanation: 'O FFAR estabelece limite de 3% da compensação de transferência para agentes atuando em nome do clube vendedor.'
  },
  {
    id: 'fifa-3',
    question: 'Qual das seguintes situações constitui exceção à proibição de transferências internacionais de menores?',
    options: [
      'A transferência ocorre entre dois clubes do mesmo país',
      'O jogador é transferido após completar 16 anos, com garantia de treinamento e educação',
      'Os pais do jogador se mudam para o país por razões não vinculadas ao futebol',
      'O jogador foi reconhecido como solicitante de asilo',
      'A transferência ocorre de fora para dentro da União Europeia'
    ],
    correctAnswer: 2,
    category: 'regulamento_fifa',
    difficulty: 'dificil',
    explanation: 'A exceção ocorre quando os pais do jogador se mudam para o país do novo clube por razões não relacionadas ao futebol (Artigo 19 do RSTP).'
  },
  {
    id: 'fifa-4',
    question: 'Qual NÃO é requisito obrigatório para obtenção inicial da licença de Agente da FIFA?',
    options: [
      'Submeter candidatura completa na Plataforma FIFA',
      'Cumprir requisitos de elegibilidade do Artigo 5º',
      'Ser aprovado no exame de agente',
      'Pagar taxa anual à FIFA',
      'Cumprir requisitos de Desenvolvimento Profissional Continuado'
    ],
    correctAnswer: 4,
    category: 'regulamento_fifa',
    difficulty: 'medio',
    explanation: 'O Desenvolvimento Profissional Continuado (CPD) é exigência para manutenção da licença, não para obtenção inicial.'
  },
  {
    id: 'fifa-5',
    question: 'Quais disposições financeiras do futebol de campo NÃO se aplicam ao futsal?',
    options: [
      'Licença para pessoa física e limitação de dupla representação',
      'Teto de comissões de 10% para clube vendedor',
      'Proibição de Propriedade por Terceiros (TPO)',
      'Compensação por Formação e Mecanismo de Solidariedade',
      'Proibição de transferência de menores de 18 anos'
    ],
    correctAnswer: 3,
    category: 'regulamento_fifa',
    difficulty: 'expert',
    explanation: 'Compensação por Formação e Mecanismo de Solidariedade não se aplicam ao futsal conforme Anexo 6 do RSTP.'
  },

  // === TEORIA TÁTICA (5 questões) ===
  {
    id: 'tatica-1',
    question: 'Qual é a principal diferença conceitual entre tática e estratégia no futebol?',
    options: [
      'Tática se refere à ocupação espacial, estratégia é a ideia geral',
      'Estratégia é o espelho do que o treinador espera, tática é distribuição numérica',
      'Tática está relacionada à ideia de jogo, estratégia à distribuição numérica',
      'Tática e estratégia são sinônimos',
      'Estratégia é ação individual, tática é ação coletiva'
    ],
    correctAnswer: 1,
    category: 'teoria_tatica',
    difficulty: 'facil',
    explanation: 'Estratégia representa a visão macro do treinador, enquanto tática se refere à disposição numérica em campo.'
  },
  {
    id: 'tatica-2', 
    question: 'Qual período e formação estão corretamente associados na evolução tática?',
    options: [
      'Consolidação Defensiva (1960-1980): Tiki-Taka',
      'Período Inicial (1920-1950): Formações como 4-4-2',
      'Era Moderna (pós-2010): Catenaccio italiano',
      'Revolução Tática (1990-2000): 4-4-2 e 3-5-2 com tecnologia',
      'Período Inicial (1920-1950): Ênfase na posse de bola'
    ],
    correctAnswer: 3,
    category: 'historia_tatica',
    difficulty: 'medio',
    explanation: 'Os anos 1990-2000 viram formações como 4-4-2 e 3-5-2 aliadas ao início da análise de dados.'
  },
  {
    id: 'tatica-3',
    question: 'No contexto dos princípios defensivos, a contenção é definida como:',
    options: [
      'Coordenação para anular finalizações adversárias',
      'Garantia de igualdade numérica setorial',
      'Rápida realização de oposição ao portador da bola',
      'Capacidade de realizar cobertura defensiva',
      'Agrupamento em zonas vitais do campo'
    ],
    correctAnswer: 2,
    category: 'principios_jogo',
    difficulty: 'facil',
    explanation: 'Contenção é a ação imediata de oposição ao jogador com posse de bola.'
  },
  {
    id: 'tatica-4',
    question: 'Quais elementos fazem parte dos princípios ofensivos?',
    options: [
      'Contenção, Cobertura Defensiva, Concentração',
      'Unidade Defensiva, Mobilidade, Largura',
      'Penetração, Cobertura Ofensiva, Mobilidade, Espaço',
      'Organização Defensiva, Transição, Bola Parada',
      'Bloqueio, Pressão, Contra-defesa, Marcação'
    ],
    correctAnswer: 2,
    category: 'principios_jogo', 
    difficulty: 'medio',
    explanation: 'Penetração, cobertura ofensiva, mobilidade e espaço são princípios fundamentais do ataque.'
  },
  {
    id: 'tatica-5',
    question: 'No Modelo de Quatro Momentos, quando uma equipe tem a posse de bola, em quais momentos pode estar?',
    options: [
      'Organização Defensiva ou Transição Ataque/Defesa',
      'Organização Ofensiva ou Transição Defesa/Ataque',
      'Pressão Alta ou Recuo Programado',
      'Contra-ataque ou Contra-defesa',
      'Bola Parada Defensiva ou Ofensiva'
    ],
    correctAnswer: 1,
    category: 'teoria_tatica',
    difficulty: 'medio',
    explanation: 'Com posse de bola, a equipe está em Organização Ofensiva ou Transição Defesa/Ataque.'
  },

  // === ANÁLISE E TECNOLOGIA (5 questões) ===
  {
    id: 'tech-1',
    question: 'Qual a principal distinção entre análise quantitativa e qualitativa no futebol?',
    options: [
      'Quantitativa usa vídeos, qualitativa foca em números',
      'Qualitativa busca entender contextos e "porquês" por trás dos números',
      'Quantitativa é feita apenas por treinadores',
      'Ambas usam exclusivamente softwares avançados',
      'Qualitativa é feita apenas por jogadores amadores'
    ],
    correctAnswer: 1,
    category: 'analise_desempenho',
    difficulty: 'facil',
    explanation: 'Análise qualitativa complementa os números com contexto e entendimento tático profundo.'
  },
  {
    id: 'tech-2',
    question: 'Em que ano o VAR foi introduzido no futebol brasileiro?',
    options: ['2006', '2010', '2014', '2018', '2024'],
    correctAnswer: 3,
    category: 'analise_desempenho',
    difficulty: 'facil',
    explanation: 'O VAR foi implementado no Campeonato Brasileiro em 2018.'
  },
  {
    id: 'tech-3',
    question: 'No Brasil, qual o percentual máximo que um clube pode vender ao se tornar SAF?',
    options: ['50%', '70%', '90%', '99%', '10%'],
    correctAnswer: 2,
    category: 'gestao_clubes',
    difficulty: 'medio',
    explanation: 'A lei permite venda de até 90% das ações, mantendo 10% com o clube social.'
  },
  {
    id: 'tech-4',
    question: 'Como a FIFA define um Intermediário (agente)?',
    options: [
      'Pessoa que representa apenas jogadores em negociações salariais',
      'Apenas pessoa jurídica responsável por SAF',
      'Pessoa física ou jurídica que representa jogadores e/ou clubes em negociações',
      'Apenas membros do Comitê de Ética da FIFA',
      'Profissional que realiza scout em competições'
    ],
    correctAnswer: 2,
    category: 'agentes_intermediarios',
    difficulty: 'medio',
    explanation: 'Intermediário é qualquer pessoa que represente jogadores ou clubes em negociações contratuais.'
  },
  {
    id: 'tech-5',
    question: 'Qual o número máximo de substituições em competições oficiais?',
    options: [
      'Três substituições',
      'Quatro substituições', 
      'Cinco substituições',
      'Sete substituições',
      'Número ilimitado'
    ],
    correctAnswer: 2,
    category: 'regulamento_fifa',
    difficulty: 'facil',
    explanation: 'Atualmente são permitidas até 5 substituições em competições oficiais (IFAB).'
  },

  // === METODOLOGIA E CONCEITOS AVANÇADOS (5 questões) ===
  {
    id: 'advanced-1',
    question: 'Qual termo é mais adequado para disposição espacial (como 4-4-2) em vez de "esquemas táticos"?',
    options: [
      'Princípios Operacionais',
      'Tática Individual', 
      'Plataforma de Jogo ou Plano Estratégico',
      'Modelo Dualista',
      'Gegenpressing'
    ],
    correctAnswer: 2,
    category: 'teoria_tatica',
    difficulty: 'medio',
    explanation: 'Plataforma de Jogo é o termo mais preciso academicamente para disposição espacial.'
  },
  {
    id: 'advanced-2',
    question: 'Pep Guardiola afirma que é impossível atacar com profundidade sem:',
    options: [
      'Posse de Bola',
      'Ambidestrismo', 
      'Amplitude',
      'Flexibilidade',
      'Organização Defensiva'
    ],
    correctAnswer: 2,
    category: 'teoria_tatica',
    difficulty: 'dificil',
    explanation: 'Amplitude cria espaços que permitem jogadas em profundidade.'
  },
  {
    id: 'advanced-3',
    question: 'Qual função ofensiva é crucial para o zagueiro moderno?',
    options: [
      'Ser principal finalizador',
      'Evitar criação de linhas de passe curtas',
      'Ser goleiro em bola aérea ofensiva',
      'Atuar na distribuição do jogo com passes curtos',
      'Focar exclusivamente em marcação individual'
    ],
    correctAnswer: 3,
    category: 'principios_jogo',
    difficulty: 'medio',
    explanation: 'Zagueiros modernos iniciam jogadas com distribuição precisa.'
  },
  {
    id: 'advanced-4',
    question: 'Qual é o conceito central da Periodização Tática?',
    options: [
      'Foco exclusivo em capacidades físicas isoladas',
      'Separação estrita em micro/meso/macrociclos',
      'Ênfase na dimensão tática integrando todas as outras',
      'Não utilização de treino de repetição',
      'Maximização da força com pesos antes do treino tático'
    ],
    correctAnswer: 2,
    category: 'metodologia_treinamento',
    difficulty: 'dificil',
    explanation: 'Periodização Tática integra todas as dimensões do jogo sob a ótica tática.'
  },
  {
    id: 'advanced-5', 
    question: 'Estudos mostram que a maioria dos gols origina-se de:',
    options: [
      'Apenas jogadas de ataque estabelecidas',
      'Gols no primeiro terço do campo',
      'Jogadas de bola parada e transições (contra-ataques)',
      'Apenas gols de bola ao chão',
      'Gols de jogadores acima do peso'
    ],
    correctAnswer: 2,
    category: 'analise_desempenho',
    difficulty: 'medio',
    explanation: 'Transições rápidas e bolas paradas são responsáveis pela maioria dos gols no futebol moderno.'
  }
]

// Funções auxiliares - DECLARADAS APENAS UMA VEZ
export const getQuestionsByCategoryAndDifficulty = (
  category: QuizCategory, 
  difficulty: Difficulty
): Question[] => {
  return quizQuestions.filter(q => 
    q.category === category && q.difficulty === difficulty
  )
}

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}