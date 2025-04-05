import { ReactNode, Children } from "react";

import "./tree.css"
import { EmployeeTree } from "../../utils";
import { EmployeeCard } from "./EmployeeCard";

export interface TreeNodeProps {
    nodeToRender: React.ReactNode;
    className?: string;
    children?: ReactNode;
}


function TreeNode({ children, nodeToRender }: TreeNodeProps) {
    return (
        <li className="tree-node-container tree-node-line">
            {nodeToRender}
            {Children.count(children) > 0 && (
                <ul className="tree-node-children">{children}</ul>
            )}
        </li>
    );
}




export const TreeChart = ({ employeeTree }: { employeeTree: EmployeeTree[] }) => {
    return (
        employeeTree.map((employee) => {
            return (
                <TreeNode key={employee.data.id} nodeToRender={<EmployeeCard employee={employee.data} />}>
                    {
                        employee.subordinates.length > 0 ? (
                            <TreeChart employeeTree={employee.subordinates} />
                        ) : undefined
                    }
                </TreeNode>
            )
        })
    )
}