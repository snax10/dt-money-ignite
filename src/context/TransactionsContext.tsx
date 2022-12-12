import { useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    category: string;
    price: number;
    createdAt: string;
}

interface CreateTransacntionInput {
    description: string;
    type: 'income' | 'outcome';
    category: string;
    price: number;
}

interface TransactionsContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransacntionInput) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
}

interface TransactionsProviderProps {
    children: React.ReactNode;
}

export const TransactionsContext = createContext({} as TransactionsContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const fetchTransactions = useCallback(async (query?: string) => {
        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            }
        })

        setTransactions(response.data)
    }, [])

    const createTransaction = useCallback(async (data: CreateTransacntionInput) => {
        const { description, price, category, type } = data

        const response = await api.post('/transactions', {
            description,
            price,
            category,
            type,
            createdAt: new Date()
        })

        setTransactions(prevState => [response.data, ...prevState])
    }, [])

    const deleteTransaction = useCallback(async (id: number) => {
        await api.delete(`/transactions/${id}`)

        setTransactions(prevState => prevState.filter(transaction => transaction.id !== id))
    }, [])


    useEffect(() => {
        fetchTransactions()
    }, [])

    return (
        <TransactionsContext.Provider value={{
            transactions,
            fetchTransactions,
            createTransaction,
            deleteTransaction,
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}