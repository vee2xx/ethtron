import React from "react";
import  ListGroup  from 'react-bootstrap/ListGroup';
import  Table  from 'react-bootstrap/Table';

function AccountList(props) {
    return (
        <div>
        <h2>Account Balances</h2>
        <Table stripped bordered hover size="sm">
            <thead>
                <tr>
                <th width="170">Account</th>
                <th width="50">Balance</th>
                </tr>
            </thead> 
            <tbody>
                {props.accounts.map((account, key) => {
                    return <tr key={key}><td>{account.address}</td>
                        <td>{account.balance}</td>
                        </tr>;
                    })}
            </tbody>
        </Table>                 
    </div>
    );
}

export default AccountList;