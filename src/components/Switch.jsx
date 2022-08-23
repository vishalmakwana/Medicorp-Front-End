const Switch = ({ on, children }) => {
    // filter out only children with a matching prop
    return children.filter(child => child.props.case === on)
}
export default Switch