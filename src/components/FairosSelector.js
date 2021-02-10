import React, { useState } from 'react';
import Dropdown  from 'react-bootstrap/Dropdown';
import FormControl  from 'react-bootstrap/FormControl';

const fairosApiEndpoints = [
    { url:"https://api.fairos.io", name:"api.fairos.io" },
    { url:"http://fairos.datafund.io",  name:"fairos.datafund.io" },
    { url:"http://dfs.radix.eth",  name:"dfx.radix.eth" },
    { url:"http://localhost:9090", name:"localhost" },
]

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));
// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Search..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          /> 
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) => !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );


const FairosSelector = (props) => {
    const [apiSelector, setApiSelector] = useState(props.apiEndpoint);
    function change(e)
    {
        props.onSelectEndpoint(e);
        setApiSelector(e);
    }
    return (
        <div className="customdropdown">
            <Dropdown >
                <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-fairosapiselector" >
                    {props.apiEndpoint}  
                </Dropdown.Toggle>
        
                <Dropdown.Menu as={CustomMenu}>
                {fairosApiEndpoints.map((d,i)=>(
                        <>
                            <Dropdown.Item href="#/action-1" active onClick={(e) => change(d.url)}> {d.name} </Dropdown.Item>
                            <Dropdown.Divider/>
                        </>
                ))}
                </Dropdown.Menu>
            </Dropdown>
      </div>
    )
  }

export default FairosSelector;