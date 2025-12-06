# 📘 README Técnico — Arena Tactical 90 Minutos

## 🧠 Visão Geral
Projeto de simulação tática de futebol em 3D com interface interativa e recursos como quiz, sistema de campeonatos e funcionalidades premium.

---

## 🧩 Stack Principal

| Tecnologia       | Versão usada       | Observações                                      |
|------------------|--------------------|--------------------------------------------------|
| React            | 18.3.1             | Mantido por compatibilidade com libs atuais     |
| Vite             | ^5.x               | Build leve e rápido para projetos modernos      |
| TypeScript       | ^5.x               | Tipagem estrita e segurança em tempo de desenvolvimento |
| Tailwind CSS     | ^3.x               | Estilização baseada em utilitários              |
| Three.js         | ^0.161.x           | Motor 3D principal                              |
| @react-three/fiber | 9.2.0           | Bridge entre Three.js e React                   |
| @react-three/drei | ^9.x              | Helpers para reduzir código repetitivo em cena 3D |

---

## 🎯 Objetivos Técnicos (Fase Atual)

- [x] Estrutura inicial da homepage com Tailwind
- [x] Componentização dos módulos principais
- [x] Configuração do campo 3D base
- [ ] Simulador com movimentação de jogadores
- [ ] Sistema de Quiz com vidas
- [ ] Autenticação de usuários
- [ ] Integração com Supabase
- [ ] Sistema de planos e restrição de acesso

---

## ⚠️ Decisões Técnicas Importantes

### 🔧 Instalação de Pacotes com `--legacy-peer-deps`
```bash
npm install three @react-three/fiber @react-three/drei --legacy-peer-deps
