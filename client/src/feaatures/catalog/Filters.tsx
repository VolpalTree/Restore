import { Box, Button, Paper} from "@mui/material";
import Search from "./Search";
import RadioButton from "../../app/sharef/components/RadioButton";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckButtons from "../../app/sharef/components/CheckButtons";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'price', label: 'Price - Low to High'},
    {value: 'priceDesc', label: 'Price - High to Low'}
];

type Props = {
    filtersData: {
    brands: string[];
    types: string[];
}
}

export default function Filters({filtersData: data}: Props) {
    
    const {orderBy, types, brands} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();


    return (
        <Box display='flex' flexDirection='column' gap={3}>
            <Paper>
                <Search/>
            </Paper>

            <Paper sx={{padding: 3}}>
                <RadioButton
                    selectedValue={orderBy}
                    options={sortOptions}
                    onChange={e => dispatch(setOrderBy(e.target.value))}
                
                />
            </Paper>

            <Paper sx={{p: 3}}>
                <CheckButtons 
                    items={data.brands}
                    checked={brands}
                    onChange={(items: string[]) => dispatch(setBrands(items))}
                />
            </Paper>

            <Paper sx={{p: 3}}>
                <CheckButtons 
                    items={data.types}
                    checked={types}
                    onChange={(items: string[]) => dispatch(setTypes(items))}
                />
            </Paper>
            <Button onClick={() => dispatch(resetParams())}>Delete Filters</Button>
        </Box>
  )
}