import { useState } from 'react';
import { useTraccarStore } from '../store/useTraccarStore';
import { Plus, Edit2, Trash2, Car, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Vehicles() {
  const { devices, addDevice, removeDevice } = useTraccarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    uniqueId: '',
    category: 'car',
    phone: '', // using phone field for license plate internally as mock
  });

  const isValidImei = /^\d{15}$/.test(formData.uniqueId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidImei) return;
    
    addDevice({
      name: formData.name,
      uniqueId: formData.uniqueId,
      category: formData.category,
      phone: formData.phone,
      model: '',
      contact: ''
    });
    
    // reset
    setIsEditing(false);
    setFormData({ name: '', uniqueId: '', category: 'car', phone: '' });
  };

  const handleRemove = (id: number) => {
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      removeDevice(id);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0F172A] p-6 gap-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Veículos</h1>
          <p className="text-slate-400 mt-1">Gerencie os rastreadores da sua frota</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
            isEditing 
              ? 'bg-slate-800 text-white hover:bg-slate-700' 
              : 'bg-[#00D4FF] text-slate-900 hover:bg-[#00D4FF]/90'
          }`}
        >
          {isEditing ? <span className="text-sm">Cancelar</span> : <><Plus className="h-4 w-4" /><span className="text-sm">Novo Veículo</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Form Column */}
        {isEditing && (
          <div className="xl:col-span-1 bg-[#1E293B] border border-slate-800 rounded-xl p-5 h-fit shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#00D4FF]" />
              Cadastrar Rastreador
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1.5">Identificação</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: HB20 Prata"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1.5 flex justify-between">
                  IMEI
                  <span className={formData.uniqueId.length > 0 ? (isValidImei ? 'text-[#00D4FF]' : 'text-red-400') : ''}>
                    {formData.uniqueId.length}/15
                  </span>
                </label>
                <input 
                  type="text" 
                  required
                  maxLength={15}
                  placeholder="15 dígitos numéricos"
                  value={formData.uniqueId}
                  onChange={(e) => setFormData({...formData, uniqueId: e.target.value.replace(/\D/g, '')})}
                  className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
                    formData.uniqueId.length > 0 && !isValidImei 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-700 focus:border-[#00D4FF] focus:ring-[#00D4FF]'
                  }`}
                />
                {formData.uniqueId.length > 0 && !isValidImei && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> IMEI deve ter exatamente 15 números
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1.5">Tipo de Veículo</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] transition-colors"
                >
                  <option value="car">Carro</option>
                  <option value="truck">Caminhão</option>
                  <option value="motorcycle">Moto</option>
                  <option value="bus">Ônibus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1.5">Placa (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="ABC-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!isValidImei || !formData.name}
                className="w-full mt-2 bg-[#00D4FF] text-slate-900 py-3 rounded-lg text-sm font-bold hover:bg-[#00D4FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                Salvar Veículo
              </button>
            </form>
          </div>
        )}

        {/* List Column */}
        <div className={`bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden flex flex-col ${isEditing ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="p-4 border-b border-slate-800 bg-[#1E293B] flex items-center justify-between">
             <h3 className="text-white font-semibold flex items-center gap-2">
               <Car className="h-4 w-4 text-[#00D4FF]" />
               Frota Cadastrada ({Object.keys(devices).length})
             </h3>
          </div>
          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-800 rounded-tl-lg">Identificação</th>
                  <th className="px-4 py-3 border-b border-slate-800">IMEI</th>
                  <th className="px-4 py-3 border-b border-slate-800">Tipo</th>
                  <th className="px-4 py-3 border-b border-slate-800">Placa</th>
                  <th className="px-4 py-3 border-b border-slate-800 text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {Object.values(devices).map((device) => (
                  <tr key={device.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-[#00D4FF]' : device.status === 'offline' ? 'bg-slate-500' : 'bg-orange-500'}`} />
                        {device.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{device.uniqueId}</td>
                    <td className="px-4 py-3 capitalize">{device.category || 'Desconhecido'}</td>
                    <td className="px-4 py-3">{device.phone || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors" title="Editar">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleRemove(device.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-md transition-colors" title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {Object.keys(devices).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Nenhum veículo cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
