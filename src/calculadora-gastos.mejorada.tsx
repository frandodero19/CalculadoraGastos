import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Euro } from 'lucide-react';

type Transaction = {
  id: string;
  type: 'ingreso' | 'gasto';
  category: string;
  amount: number;
  description: string;
  date: Date;
};

const categories = {
  ingreso: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
  gasto: ['Alimentación', 'Vivienda', 'Transporte', 'Servicios', 'Entretenimiento', 'Otros']
};

type Category =
  | 'Salario'
  | 'Freelance'
  | 'Inversiones'
  | 'Otros'
  | 'Alimentación'
  | 'Vivienda'
  | 'Transporte'
  | 'Servicios'
  | 'Entretenimiento';

const categoryEmojis: Record<Category, string> = {
  'Salario': '💼',
  'Freelance': '🖥️',
  'Inversiones': '📈',
  'Otros': '🔄',
  'Alimentación': '🍽️',
  'Vivienda': '🏠',
  'Transporte': '🚗',
  'Servicios': '📱',
  'Entretenimiento': '🎭',
};

export default function CalculadoraGastos() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'date'>>({
    type: 'gasto',
    category: '',
    amount: 0,
    description: ''
  });
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState<'all' | 'ingreso' | 'gasto'>('all');

  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === 'ingreso' ? transaction.amount : -transaction.amount);
    }, 0);
    setBalance(newBalance);
  }, [transactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = () => {
    if (newTransaction.amount <= 0 || !newTransaction.category) return;
    setTransactions(prev => [...prev, { ...newTransaction, id: Date.now().toString(), date: new Date() }]);
    setNewTransaction({ type: 'gasto', category: '', amount: 0, description: '' });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">Calculadora de Gastos Personales</h1>
          <p className="text-center text-blue-100 mt-2 text-sm sm:text-base">Desarrollado por Francisco Dodero</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Saldo Actual</h2>
              <span className={`text-xl sm:text-2xl font-bold flex items-center ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <Euro className="h-5 w-5 sm:h-6 sm:w-6 mr-1" />
                {balance.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="text-gray-700">Tipo</label>
                <select 
                  value={newTransaction.type} 
                  onChange={(e) => handleSelectChange('type', e.target.value)}
                  className="bg-white border border-gray-300 p-2 rounded-md"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="text-gray-700">Categoría</label>
                <select 
                  value={newTransaction.category} 
                  onChange={(e) => handleSelectChange('category', e.target.value)}
                  className="bg-white border border-gray-300 p-2 rounded-md"
                >
                  {categories[newTransaction.type].map(category => (
                    <option key={category} value={category}>
                      {categoryEmojis[category as Category]} {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="text-gray-700">Cantidad</label>
                <div className="relative">
                  <input 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    value={newTransaction.amount || ''} 
                    onChange={handleInputChange} 
                    placeholder="Introducir cantidad"
                    className="pl-8 bg-white border border-gray-300 p-2 rounded-md"
                  />
                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="text-gray-700">Descripción</label>
                <input 
                  type="text" 
                  id="description" 
                  name="description" 
                  value={newTransaction.description} 
                  onChange={handleInputChange} 
                  placeholder="Introducir descripción"
                  className="bg-white border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>

            <button 
              onClick={handleAddTransaction} 
              className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition duration-200"
            >
              <Plus className="mr-2 h-4 w-4" /> Añadir Transacción
            </button>

            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg font-semibold">Transacciones</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFilter('all')} 
                    className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilter('ingreso')} 
                    className={`px-4 py-2 rounded-md ${filter === 'ingreso' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Ingresos
                  </button>
                  <button 
                    onClick={() => setFilter('gasto')} 
                    className={`px-4 py-2 rounded-md ${filter === 'gasto' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Gastos
                  </button>
                </div>
              </div>
              {filteredTransactions.length === 0 ? (
                <p className="text-gray-500">No hay transacciones.</p>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map(transaction => (
                    <div key={transaction.id} className="bg-white p-4 rounded-md shadow-md border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{categoryEmojis[transaction.category as Category]}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">{transaction.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                          <Euro className="h-5 w-5 inline" />
                          {transaction.amount.toFixed(2)}
                        </span>
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
