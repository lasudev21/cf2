import moment from "moment";

export interface IFlujoUtilidades {
  data: IData;
  sum: number;
}

export interface IData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  next_page_url: string;
  prev_page_url: null;
  from: number;
  to: number;
  data: IDataFU[];
}

export interface IDataFU {
  id: number;
  descripcion: string;
  tipo: number;
  valor: number;
  fecha: string;
  created_at: Date;
  updated_at: Date;
}

export interface IErrorsFU {
  id: string;
  descripcion: string;
  tipo: string;
  valor: string;
  fecha: string;
  created_at: string;
  updated_at: string;
}

export const FUVacio = {
  id: 0,
  descripcion: "",
  tipo: 1,
  valor: 0,
  fecha: moment(new Date()).format("YYYY-MM-DD"),
  created_at: new Date(),
  updated_at: new Date(),
};

export interface ICreateFU {
  Descripcion: string;
  Tipo: number;
  Valor: number;
  Fecha: string;
}
