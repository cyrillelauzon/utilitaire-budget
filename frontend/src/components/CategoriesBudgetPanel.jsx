/*-------------------------------------------------------------------------
Component   CategoriesBudgetPanel
Description: 
Display Categories mini-budget panel at right of Transactions screen
-------------------------------------------------------------------------*/
import React, { Children, Component } from 'react';
import Table from 'react-bootstrap/Table';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button';
import './css/categoriesbudgetpanel.scss';


class CategoriesBudgetPanel extends Component {
    state = {}

    render() {
        let categories = this.props.categories;
        return (
            <React.Fragment>
                <div className="categories-budget-panel">
                    <Table key={"categoriesTable"}>
                        <thead>
                            <tr>
                                <th key={"toto"}>Catégories de dépenses</th>
                                <th key={"tot=fo"}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => {
                                
                                //TODO Ajouter dép non comptabilisées et ligne Total
                                //TODO Ajouter hyperliens vers filtres

                                return (
                                    <React.Fragment key={"frag" + category.name}>

                                        <tr key={"catro"} className="bg-table-row-selected">
                                            <td key={"catcellnewm"}>{category.name}</td>
                                            <td key={"catceltl"}>{parseFloat(category.total).toFixed(2)+"$"}</td>
                                        </tr>

                                        {category.child_categories.map((child) => {
                                            return (<tr key={"childrow"} className="bg-table-row">
                                                <td key={"childcell"}>{child.name}</td>
                                                <td key={"childtotal"}>{ parseFloat(child.total).toFixed(2) +"$"}</td>
                                            </tr>)
                                            })
                                        }

                                        

                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>

            </React.Fragment>
        );
    }
}

export default CategoriesBudgetPanel;