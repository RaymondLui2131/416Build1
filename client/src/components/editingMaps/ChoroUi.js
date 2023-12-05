import { MAP_TYPES } from "../../constants/MapTypes"
import { HexColorPicker } from "react-colorful"
import { useState, useEffect, useContext } from "react"
import { ChoroEdit } from "../../editMapDataStructures/ChoroplethMapData"
import ChoroTransaction from "../../transactions/ChoroTransaction"
import { MapContext } from "../../api/MapContext"
const KeyRow = (props) => {
    const color = props.color
    const setColor = props.setColor
    const keyTable = props.keyTable
    const setKeyTable = props.setKeyTable
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const [label, setLabel] = useState(props.label)

    const handleRemove = (color) => {
        const filtered = keyTable.filter((row) => row.color !== color)
        const filterEdits = editsList.filter((edit) => edit.colorHEX !== color) //remove coloring of features after removing key
        // console.log("filtered list",filtered)
        setKeyTable(filtered)
        setEditsList(filterEdits)

    }
    const handleUpdateLabel = (text) => {
        const currKeyTable = [...keyTable]
        const found = currKeyTable.find((row) => row.color === color)
        found.label = text
        setKeyTable(currKeyTable)
        setLabel(text)
    }
    return (
        <>
            <div className="flex flex-row">
                <div className="w-1/3">
                    <button className='text-red-600' onClick={() => handleRemove(color)}>X</button>
                </div>
                <div className='pl-7'>
                    <div onClick={() => setColor(color)} className='flex w-5 h-5 border-2 border-black'
                        style={{ backgroundColor: color }}>
                    </div>
                </div>
            </div>

            <div className='flex justify-center items-end'>
                <input className='w-4/12 border-2 border-black' type='text' value={label} onChange={(e) => { handleUpdateLabel(e.target.value) }} />
            </div>
        </>
    )

}

export const ChoroUi = (props) => {
    const setType = props.setType
    const choroColor = props.choroColor
    const setColor = props.setColor
    const key = props.key
    const setKey = props.setKey
    const label = props.label
    const setLabel = props.setLabel
    const keyTable = props.keyTable
    const setKeyTable = props.setKeyTable
    const areaClicked = props.areaClicked
    const setAreaClicked = props.setAreaClicked
    const editsList = props.editsList
    const setEditsList = props.setEditsList
    const { transactions } = useContext(MapContext)

    const addChoroColor = (choroColor, areaClicked, setAreaClicked, keyTable, setKeyTable, editsList, setEditsList) => {
        if (areaClicked) {
            console.log('something clicked', areaClicked)
            console.log(transactions.toString())
            let newColor = [...editsList]
            newColor = newColor.filter((edit) => edit.colorHEX === choroColor)
            // console.log("newColor",newColor)
            if (newColor.length === 0) {  //New Color
                const newKeyLabel = {
                    color: choroColor,
                    label: '',
                }
                const newTable = [...keyTable]
                newTable.push(newKeyLabel)
                setKeyTable(newTable)
            }
            const newEdit = new ChoroEdit(areaClicked, choroColor)
            let copyEdits = [...editsList]
            copyEdits = copyEdits.filter((edit) => edit.featureName !== areaClicked)
            copyEdits.push(newEdit)

            setEditsList(copyEdits)
            // console.log("edits",copyEdits)


            setAreaClicked(null)
        }
    }

    const removeChoroColor = (areaToRemove, keyTable, setKeyTable, editsList, setEditsList) => {
        let updatedEdits = [...editsList];

        // Remove the edit associated with the specified areaToRemove
        updatedEdits = updatedEdits.filter((edit) => edit.featureName !== areaToRemove);

        // Get the color of the removed area
        const removedColor = editsList.find((edit) => edit.featureName === areaToRemove)?.colorHEX;

        if (removedColor) {
            // Remove the color from the editsList
            const remainingColors = updatedEdits.map((edit) => edit.colorHEX);
            const colorExists = remainingColors.includes(removedColor);

            if (!colorExists) {
                // If no other areas have this color, remove it from the keyTable
                const updatedKeyTable = keyTable.filter((item) => item.color !== removedColor);
                setKeyTable(updatedKeyTable);
            }
        }

        setEditsList(updatedEdits);
    };

    useEffect(() => {
        let transaction = new ChoroTransaction(choroColor, areaClicked, setAreaClicked, keyTable, setKeyTable, editsList, setEditsList, addChoroColor, removeChoroColor)
        transactions.addTransaction(transaction)
    }, [areaClicked])


    const choroColorFormat = choroColor.toUpperCase()
    const renderKeyTable = keyTable.map((row) => <KeyRow key={row.color} {...row}
        setColor={setColor} setKeyTable={setKeyTable} keyTable={keyTable}
        editsList={editsList} setEditsList={setEditsList}
    />)
    return (
        <>
            <div className='invisible'>gap space</div>
            <div className='h-full w-96 bg-gray-50 rounded-3xl font-NanumSquareNeoOTF-Lt flex flex-col'>
                <div className='bg-primary-GeoOrange rounded-t-3xl choroOptions' onClick={() => setType(MAP_TYPES['NONE'])}><div>Color Selector</div>
                </div>
                <div className='flex flex-col items-center pt-10 w-full mx-auto'>
                    <HexColorPicker color={choroColor} onChange={setColor} style={{ width: '80%', height: '300px' }} />
                </div>
                <div>Hex Color: {choroColorFormat}</div>
                <div className='grid grid-cols-2 gap-2 pt-2 text-sm overflow-y-auto'>
                    <div>Key</div>
                    <div>Label</div>
                    {renderKeyTable}
                </div>


            </div>
        </>
    )
}

export default ChoroUi