'use client';

import { FormControl, TextField, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { useEffect, useState, ReactNode } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { useGetCurrencyMutation, useConvertCurrencyMutation, useGetRateMutation } from '@/services/currency_converter';




interface IState {
  currecyFrom?: IStateCurrencyOption;
  currencyTo?: IStateCurrencyOption;
  value: number;
  result: number;
}


interface IStateCurrencyOption {
  name: string;
  code: string;
}

interface IStateRateData {
  code: string;
  value: number
}

interface IStateRate {
  timeUpdate: number;
  rate: IStateRateData[];
}


export default function Home() {

  const [currencys, setCurrencys] = useState<IStateCurrencyOption[]>([])
  const [timeUpdate, setTimeUpdate] = useState<string>("0/0/0 00:00");
  const [rate, setRate] = useState<IStateRate>({
    timeUpdate: 0,
    rate: [],
  })

  const [getCurrency] = useGetCurrencyMutation();
  const [convert] = useConvertCurrencyMutation();
  const [getRate] = useGetRateMutation();

  const [store, setStore] = useState<IState>({
    currecyFrom: undefined,
    currencyTo: undefined,
    value: 0,
    result: 0,
  });


  const handleConvert = (event: any) => {
    if(!store.currecyFrom || !store.currencyTo) {
      alert("Chose The Currency")
    } else {
      convert({ 
        currency_form: store.currecyFrom.code || "",
        currency_to: store.currencyTo.code || "",
        value: store.value,
      }).then(res => {
        if ("data" in res) {
          if(res.data.data?.result) {
            setStore(pre => ({ ...pre, result: res.data.data?.result }))
          }
        } else {
            console.log("An error occurred:", res.error);
        }
      })
    }
  };


  const handleChangeFrom = (val: IStateCurrencyOption) => () => {
    setStore(pre => ({ ...pre, currecyFrom: val }))
  }

  const handleChangeTo = (val: IStateCurrencyOption) => () => {
    setStore(pre => ({ ...pre, currencyTo: val }))
  }



  


  useEffect(() => {
    getCurrency({}).then(res => {
      if ("data" in res) {
        if(res.data.data?.currencies && res.data.data?.currencies.length > 0) {
          setCurrencys((res.data.data?.currencies as IStateCurrencyOption[]))
        }
      } else {
          console.log("An error occurred:", res.error);
      }
    })
  }, [])



  const gettingRate = () => {
    getRate({}).then(res => {
      if ("data" in res) {
        if(res.data.data) {
          const data = res.data.data;
          if(data.rates && data.rates.length > 0) {
            setRate(pre => ({ ...pre, rate: (data.rates as IStateRateData[]), timeUpdate: data.time_last_update_unix }))
          }
          if(data.time_last_update_unix) {
            const date = new Date(data.time_last_update_unix * 1000);
            setTimeUpdate(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`)
          }
        }
      } else {
          console.log("An error occurred:", res.error);
      }
    })
  }


  useEffect(() => {
    gettingRate()
  }, [])



  const reloadRate = () => {
    gettingRate()
  }


  return (
    <main
    className={`flex flex-col w-full-screen justify-center p-8 mb-20`}
  >

  
    <div className='flex space-x-4'>
      <div className="flex-col">
        <div className="flex space-x-2">
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="select-label" shrink={true} style={{ display: 'none' }}>Select</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={store?.currecyFrom}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {
                currencys.map(item => {
                  return (
                    <MenuItem key={Math.random()} value={item.code} onClick={handleChangeFrom(item)}>{ item.name }</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="select-label" shrink={true} style={{ display: 'none' }}>Select</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={store?.currencyTo}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {
                currencys.map(item => {
                  return (
                    <MenuItem key={Math.random()} value={item.code} onClick={handleChangeTo(item)}>{ item.name }</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </div>

        <div className="flex-col">
          <TextField
            id="outlined-basic" type="number" label="Input Value to Convert" variant="outlined" sx={{ mt: 2, width: 300 }}
            onChange={(e) => {
              setStore(p => ({ ...p, value: Number(e.target.value) }))
            }}/>


            <Button onClick={handleConvert} variant="outlined" sx={{ width: 100, mt: 2, ml: 2 }}>Convert</Button>

            <div className="mt-6 font-bold text-lg">
              <h3>Result : {store.result.toFixed(2)} {store.currencyTo?.code}</h3>
            </div>

          

        </div>


      </div>
      
      
      <div>
        <h2 className='mb-4'>Currency Rate</h2>
        <span className='flex mb-2'>
          Time Updated {timeUpdate}
        </span>
        <Button onClick={reloadRate} variant="outlined" sx={{ width: 100, mt: 2, ml: 2, mb: 2 }}>Reload</Button>
        <DataGrid
            rows={rate.rate}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 50 },
              },
            }}
            // pageSizeOptions={[25, 10]}
            checkboxSelection
          />
      </div>

      
    </div>
    

  </main>
  )
}


const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 70 },
  { field: 'value', headerName: 'Value', width: 130 },
];