import { useContext } from "react";
import { DeletedButton, PriceHighlight, TransactionsContainer, TransactionsTable } from "./styles";
import { Header } from "../../components/Header";
import { Summary } from "../../components/Summary";
import { SearchForm } from "./components/SeachForm";
import { TransactionsContext } from "../../context/TransactionsContext";
import { dateFormatter, priceFormatter } from "../../utils/formatter";
import { Trash } from 'phosphor-react'

export function Transactions() {

    const { transactions, deleteTransaction } = useContext(TransactionsContext)

    return (
        <div>
            <Header />
            <Summary />

            <TransactionsContainer>
                <SearchForm />
                <TransactionsTable>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td width="50%">{transaction.description}</td>
                                <td>
                                    <PriceHighlight variant={transaction.type}>
                                        {/* {transaction.type === 'outcome' && '- '} */}
                                        {priceFormatter.format(transaction.price)}
                                    </PriceHighlight>
                                </td>
                                <td>{transaction.category}</td>
                                <td>
                                    {
                                        dateFormatter.format(new Date(transaction.createdAt))
                                    }
                                </td>
                                <td>
                                    <DeletedButton onClick={() => deleteTransaction(transaction.id)}>
                                        <Trash size={20} />
                                    </DeletedButton>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </TransactionsTable>
            </TransactionsContainer>

        </div>

    )
}