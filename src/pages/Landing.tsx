import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Car, ArrowRight, RefreshCw, Rocket, Truck, 
  Map as MapIcon, Bell, Zap, FileText, Wrench, Users, Palette, 
  CheckCircle2, Shield, Cpu, LifeBuoy, CreditCard, Play
} from 'lucide-react';
import { cn } from '../lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export default function Landing() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-[#00D4FF]/30 selection:text-white">
      
      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00D4FF]">
            <div className="relative flex items-center justify-center">
              <MapPin className="h-8 w-8" />
              <Car className="h-4 w-4 absolute -mt-1" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Rotta</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Acessar Sistema
            </Link>
            <a href="#contato" className="bg-[#00D4FF] text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00D4FF]/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.15)]">
              Falar com especialista
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div {...fadeIn} className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Sua própria empresa de rastreamento veicular, <span className="text-[#00D4FF]">sem construir do zero.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Plataforma white-label completa para revenda. Ofereça um sistema premium, rápido e escalável com a sua marca, enquanto nós cuidamos da infraestrutura tecnológica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contato" className="flex items-center justify-center gap-2 bg-[#00D4FF] text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-[#00D4FF]/90 transition-all text-lg">
                Quero revender <ArrowRight className="h-5 w-5" />
              </a>
              <Link to="/login" className="flex items-center justify-center gap-2 bg-[#1E293B] border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all text-lg">
                <Play className="h-5 w-5 fill-current" /> Ver demonstração
              </Link>
            </div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#00D4FF]/30 to-[#00D4FF]/0 rounded-2xl blur-lg"></div>
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative z-10">
              <div className="h-10 bg-[#0F172A] border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="p-4 flex gap-4 h-[400px]">
                {/* Sidebar mock */}
                <div className="w-1/3 flex flex-col gap-3">
                  <div className="h-8 bg-slate-800 rounded-md w-full"></div>
                  <div className="flex-1 bg-slate-900/50 rounded-lg border border-slate-800 p-3 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-slate-800/50 rounded-md flex items-center px-3 gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#00D4FF]"></div>
                        <div className="space-y-1.5 flex-1">
                          <div className="h-2 w-20 bg-slate-600 rounded"></div>
                          <div className="h-2 w-12 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Map mock */}
                <div className="flex-1 bg-[#0F172A] rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png')] bg-repeat"></div>
                  <div className="absolute bg-[#1E293B] p-3 rounded-lg border border-slate-700 shadow-xl flex items-center gap-3">
                     <Car className="h-6 w-6 text-[#00D4FF]" />
                     <div>
                       <div className="h-2 w-16 bg-slate-400 rounded mb-1"></div>
                       <div className="h-3 w-24 bg-white rounded"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-[#1E293B]/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Para quem é a Rotta?</h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: RefreshCw, title: 'Migrando de Fornecedor', desc: 'Plataformas atuais instáveis ou lentas? Migre sua base de clientes sem fricção e ofereça um upgrade visual imediato.' },
              { icon: Rocket, title: 'Começando do Zero', desc: 'Lançando seu negócio agora? Tenha a tecnologia pronta em dias, concentre-se nas vendas e no atendimento.' },
              { icon: Truck, title: 'Frotas e Locadoras', desc: 'Gerencie sua própria frota com um sistema robusto, personalizado com as cores e logo da sua empresa.' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-[#1E293B] border border-slate-700 p-8 rounded-2xl">
                <div className="h-12 w-12 bg-[#00D4FF]/10 text-[#00D4FF] rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Tudo que uma operação moderna exige</h2>
            <p className="text-lg text-slate-400">Uma suíte completa de ferramentas para entregar o máximo de valor ao seu cliente final, sem integrações complexas.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: MapIcon, title: 'Rastreamento Real-Time', desc: 'Atualizações via WebSocket sem recarregar a tela.' },
              { icon: MapPin, title: 'Cercas Virtuais', desc: 'Polígonos e rotas restritas com alertas de saída.' },
              { icon: Zap, title: 'Bloqueio Remoto', desc: 'Corte de motor instantâneo integrado no painel.' },
              { icon: Bell, title: 'Notificações Inteligentes', desc: 'Alertas de ignição, velocidade e bateria fraca.' },
              { icon: FileText, title: 'Relatórios Completos', desc: 'KMs rodados, horas de motor, exportáveis em CSV.' },
              { icon: Palette, title: 'Marca Própria (White-Label)', desc: 'Suas cores, seu logo, seu domínio.' },
              { icon: Users, title: 'Cadastro de Motoristas', desc: 'Vincule condutores e analise o comportamento.' },
              { icon: Wrench, title: 'Manutenção Preventiva', desc: 'Avisos de troca de óleo e revisões programadas.' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-[#1E293B] hover:border-slate-700 transition-colors group">
                <feature.icon className="h-8 w-8 text-[#00D4FF] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-[#1E293B]/40 border-y border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Lançamento em 4 passos</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-slate-800"></div>
            {[
              { num: '01', title: 'Onboarding', desc: 'Definição de marca, domínio e cores.' },
              { num: '02', title: 'Compatibilidade', desc: 'Conexão dos seus modelos de rastreadores.' },
              { num: '03', title: 'Migração', desc: 'Importação assistida da sua base antiga.' },
              { num: '04', title: 'Operação', desc: 'Sistema no ar, pronto para faturar.' }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="relative z-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-[#0F172A] border-2 border-[#00D4FF] flex items-center justify-center text-lg font-bold text-white mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Escolha o plano ideal para sua operação</h2>
            <p className="text-slate-400">Mensalidade fixa baseada em recursos, mais custo unitário por veículo rastreado.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Basic */}
            <motion.div {...fadeIn} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Start</h3>
              <p className="text-slate-400 text-sm mb-6">Ideal para quem está iniciando.</p>
              <div className="text-4xl font-bold text-white mb-8">R$ 199<span className="text-lg text-slate-500 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8">
                {['Rastreamento em Tempo Real', 'Histórico de 30 dias', 'Comandos Básicos', 'App Android/iOS (Genérico)'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-[#00D4FF] flex-shrink-0" /> <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-600">Escolher Start</button>
            </motion.div>

            {/* Pro - Highlighted */}
            <motion.div {...fadeIn} className="bg-[#1E293B] border-2 border-[#00D4FF] rounded-2xl p-8 relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Mais Procurado
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro (White-Label)</h3>
              <p className="text-slate-400 text-sm mb-6">A plataforma com a sua marca e identidade.</p>
              <div className="text-4xl font-bold text-white mb-8">R$ 499<span className="text-lg text-slate-500 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8">
                {['Tudo do Start', 'Sua Logo e Cores (Domínio próprio)', 'Histórico de 90 dias', 'Relatórios Avançados', 'Acesso via API'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-[#00D4FF] flex-shrink-0" /> <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[#00D4FF] text-slate-900 font-bold py-3 rounded-xl hover:bg-[#00D4FF]/90 transition-colors">Escolher Pro</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div {...fadeIn} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-6">Para frotas gigantes e integrações complexas.</p>
              <div className="text-4xl font-bold text-white mb-8">R$ 999<span className="text-lg text-slate-500 font-normal">/mês</span></div>
              <ul className="space-y-4 mb-8">
                {['Tudo do Pro', 'App White-Label nas Lojas', 'Histórico Ilimitado', 'SLA Garantido 99.9%', 'Gerente de Contas Dedicado'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-[#00D4FF] flex-shrink-0" /> <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-600">Falar com Consultor</button>
            </motion.div>
          </div>

          {/* Volume Pricing */}
          <motion.div {...fadeIn} className="max-w-3xl mx-auto mt-16 bg-[#1E293B]/50 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Custo de Licença por Veículo Ativo (Faturado à parte)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="pb-3 px-4 font-semibold">Volume (Veículos)</th>
                    <th className="pb-3 px-4 text-right font-semibold">Valor Unitário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr><td className="py-4 px-4 font-medium">1 a 20</td><td className="py-4 px-4 text-right font-mono">R$ 5,90 / mês</td></tr>
                  <tr><td className="py-4 px-4 font-medium">21 a 50</td><td className="py-4 px-4 text-right font-mono text-[#00D4FF]">R$ 4,90 / mês</td></tr>
                  <tr><td className="py-4 px-4 font-medium">51 a 100</td><td className="py-4 px-4 text-right font-mono text-[#00D4FF]">R$ 3,90 / mês</td></tr>
                  <tr><td className="py-4 px-4 font-medium">Mais de 100</td><td className="py-4 px-4 text-right font-mono text-[#00D4FF]">Personalizado</td></tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Differentials */}
      <section className="py-20 bg-[#1E293B]/40 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Isolamento Total', desc: 'Seus dados e de seus clientes separados em bancos independentes de alta segurança.' },
              { icon: Cpu, title: '+200 Rastreadores', desc: 'Compatível com os principais hardwares do mercado global e nacional.' },
              { icon: LifeBuoy, title: 'Onboarding Assistido', desc: 'Nossa equipe técnica apoia a homologação de equipamentos na plataforma.' },
              { icon: CreditCard, title: 'Cobrança Simples', desc: 'Fature seus clientes da forma que achar melhor. Só cobramos pelos veículos ativos.' }
            ].map((diff, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <diff.icon className="h-10 w-10 text-slate-400 mb-4" />
                <h4 className="text-white font-bold mb-2">{diff.title}</h4>
                <p className="text-sm text-slate-400">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA / Form */}
      <section id="contato" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Pronto para lançar sua operação?</h2>
              <p className="text-slate-400 mb-8">Preencha o formulário e um especialista entrará em contato para agendar uma demonstração técnica e montar a melhor proposta para o seu volume.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-[#00D4FF]" /> Setup inicial rápido
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-[#00D4FF]" /> Migração segura
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 bg-[#00D4FF]/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#00D4FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Recebemos seu contato!</h3>
                  <p className="text-slate-400 text-sm">Em breve nosso time comercial chamará você no WhatsApp para continuarmos a conversa.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Nome Completo</label>
                    <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none transition-colors" placeholder="João Silva" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1.5 block">E-mail Profissional</label>
                    <input required type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none transition-colors" placeholder="joao@empresa.com" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1.5 block">WhatsApp</label>
                    <input required type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none transition-colors" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Quantos veículos pretende gerenciar?</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none transition-colors appearance-none">
                      <option value="1-20">1 a 20 veículos</option>
                      <option value="21-50">21 a 50 veículos</option>
                      <option value="51-100">51 a 100 veículos</option>
                      <option value="100+">Mais de 100 veículos</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#00D4FF] text-slate-900 font-bold py-3 rounded-lg hover:bg-[#00D4FF]/90 transition-colors mt-2">
                    Quero Começar
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#00D4FF]">
            <MapPin className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-white">Rotta</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Documentação da API</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Rotta. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
