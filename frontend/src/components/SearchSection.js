import React, { useState } from "react";
import { Text, Spacer, Button, Select } from '@geist-ui/core';
import { Circle, Search } from '@geist-ui/icons';

const SearchSection = ({node, addGraph}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [select, setSelect] = useState("breath");
  
    const styles = {
        divcol: {
            padding: '4px', 
            borderRadius: '10px',
            margin: '5px',
            display: 'flex', 
            flexDirection: 'column',
            alignContent: "center"
        },
        divrow: {
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: "center"
        },
    }


    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleSelect = (val) => {
        console.log(val);
        setSelect(val)
    }

    const onSubmitButtonPressed = () => {
        addGraph(node, select);
    }

  return (
    <div style={styles.divcol}>
        <div style={styles.divrow}>
            <Select placeholder="Choose one" onChange={handleSelect} initialValue={"breath"} >
                <Select.Option value="breath">breath-first</Select.Option>
                <Select.Option value="depth">depth-first</Select.Option>
            </Select>
            <Spacer w={1}/>
            {
                select === "breath" ?
                <Text small>search on</Text>
                :
                <Text small>in the direction of</Text>
            }
            <Spacer w={1}/>
            <Button
                icon={<Circle />} auto
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ background: isHovered ? '#CBC3E3' : 'white' , border: 'none'}}
            >
                {
                    node ?
                    node.label
                    :
                    "(drag & drop)"
                }
            </Button>
            <Button icon={<Search />} auto onClick={onSubmitButtonPressed}></Button>
        </div>
    </div>
  );
};

export default SearchSection;