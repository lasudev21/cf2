import { ICrearCredito, IEstadoCreditoActual } from "./ICredito";

export interface IPeriodos {
  modosPago: IItemsCBox[];
  dias: IItemsCBoxV1[];
  rutas: IItemsCBox[];
}

export interface ICbox {
  data: IItemsCBox[];
}

export interface IItemsCBox {
  value: number;
  label: string;
}

export interface IItemsCBoxV1 {
  id: string;
  label: string;
}

export interface ICuota {
  Id: number;
  Cuota: number | null;
  Orden: number;
  Obs: string;
  Observaciones: string;
  Congelar: boolean;
  Mora: number | null;
  Nuevo: ICrearCredito | null;
  ReversarCuota: boolean;
  Modificado: boolean;
  ModificadoData: IEstadoCreditoActual;
}
