/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import {
  getCobradores,
  getNomina,
  postNomina,
} from "../../../services/nominaService";
import {
  INominaCobrador,
  INominaCobradorData,
  INominaData,
  IVale,
} from "../../../types/INomina";
import { useNominaStore } from "../../../store/NominaStore";
import { IconButton } from "@mui/material";
import { Plus, Printer, Save, Search } from "lucide-react";
import { useDashboardStore } from "../../../store/DashboardStore";
import Modal from "../../../components/Common/Modal";
import VerReporte from "../../../components/Reportes/Mensual/VerReporte";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import AgregarCobrador from "../../../components/Reportes/Mensual/AgregarCobrador";
import { TypeToastEnum } from "../../../types/IToast";
import MenuTabla from "../../../components/Reportes/Mensual/MenuTabla";
import AgregarVales from "../../../components/Reportes/Mensual/AgregarVales";
import VerVales from "../../../components/Reportes/Mensual/VerVales";
import { exportarMensual } from "../../../utils/pdfMakeExport";

const Nomina = () => {
  const gridRef = useRef<any>();
  const [height, setHeight] = useState<number>(0);
  const [nombre, setNombre] = useState<string>("");
  const [contentModal, setContentModal] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string>("");
  const { setCobradores, fechas, setList, list, nomina_id, month, year } =
    useNominaStore();
  const { setOpenModal, openModal, isMobile, setLoader, setErrorsToast } =
    useDashboardStore();

  const Cobradores = async () => {
    setLoader(true);
    const response = await getCobradores();
    const data: INominaData = response;
    setCobradores(data);
    setLoader(false);
  };

  useEffect(() => {
    Cobradores();

    const handleResize = () => {
      const calculatedHeight = window.innerHeight - (isMobile ? 210 : 180);
      setHeight(calculatedHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (month !== null) setNombre(obtenerNombreMes(Number(month)));
  }, [month]);

  function obtenerNombreMes(numeroMes: number): string {
    const fecha = new Date();
    fecha.setMonth(numeroMes);
    const nombreMes = fecha.toLocaleString("es-ES", { month: "long" });

    return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  }

  const AbrirModal = (tipo: string, index: number | null = null) => {
    switch (tipo) {
      case "agregarCobrador":
        setContentModal(<AgregarCobrador />);
        setTitle("Agregar cobrador");
        break;
      case "buscarNomina":
        setContentModal(
          <VerReporte
            data={fechas}
            action={handleVerNomina}
          />
        );
        setTitle("Buscar nomina");
        break;
      case "agregarVale":
        setContentModal(<AgregarVales index={Number(index)} />);
        setTitle("Agregar nuevo vale");
        break;
      case "verVales":
        setContentModal(<VerVales index={Number(index)} />);
        setTitle("Ver vales");
        break;
    }
    setOpenModal(true);
  };

  const handleVerNomina = async (month: number, year: number) => {
    setLoader(true);
    const response = await getNomina(month, year);
    const data: INominaCobradorData = response;
    if (data.data.length === 0) {
      setErrorsToast([
        {
          message:
            "No existe una nómina creda para esa fecha en especifico, si lo deseea, por favor cree una.",
          type: TypeToastEnum.Warning,
        },
      ]);
    }
    setList(data.data, month, year);
    setLoader(false);
    setOpenModal(false);
  };

  const handleGuardarNomina = async () => {
    setLoader(true);
    const response = await postNomina(
      nomina_id,
      Number(year),
      Number(month),
      list
    );
    const data: INominaCobradorData = response;
    setList(data.data, Number(month), Number(year));
    setErrorsToast([
      {
        message: "Se han guardado los cambios a la nomina",
        type: TypeToastEnum.Susccess,
      },
    ]);
    setLoader(false);
  };

  const handleAgregarVales = (id: number) => {
    AbrirModal("agregarVale", id);
  };

  const handleVerVales = (id: number) => {
    AbrirModal("verVales", id);
  };

  const onGridReady = (params: { api: GridApi }) => {
    params.api.sizeColumnsToFit();
    params.api.setGridOption("rowData", list);
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 150,
      filter: false,
      sortable: false,
      lockPosition: "left",
      headerClass: "bg-stone-50 text-gray-700 font-bold",
    };
  }, []);

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "",
      field: "id",
      width: 60,
      pinned: "left",
      cellRenderer: (params: any) => (
        <MenuTabla
          data={params}
          actionAgregarVales={handleAgregarVales}
          actionVerVales={handleVerVales}
        />
      ),
    },
    {
      headerName: "Cobrador",
      headerClass: "bg-stone-50 text-gray-700 font-bold",
      children: [
        {
          headerName: "Nombres",
          field: "cobrador.nombres",
        },
        {
          headerName: "Apellidos",
          field: "cobrador.nombres",
        },
      ],
    },
    {
      headerName: "Salario",
      field: "salario",
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Días laborados",
      field: "dias_laborados",
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Salario bruto",
      field: "bruto",
      valueGetter: (params: any) => {
        return Number(params.data.salario) * Number(params.data.dias_laborados);
      },
    },
    {
      headerName: "EPS",
      field: "eps",
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Ahorro",
      field: "ahorro",
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Totales",
      headerClass: "bg-stone-50 text-gray-700 font-bold",
      children: [
        {
          headerName: "Vales",
          field: "vales",
          valueGetter: (params: any) => {
            return params.data.vales.reduce((acc: number, vale: IVale) => {
              return acc + (vale.valor || 0);
            }, 0);
          },
        },
        {
          headerName: "Descuento",
          field: "total",
          valueGetter: (params: any) => {
            return (
              Number(params.data.eps) +
              params.data.vales.reduce((acc: number, vale: IVale) => {
                return acc + (vale.valor || 0);
              }, 0)
            );
          },
        },
        {
          headerName: "Total a pagar",
          field: "total",
          valueGetter: (params: any) => {
            return (
              Number(params.data.salario) * Number(params.data.dias_laborados) -
              (Number(params.data.eps) +
                params.data.vales.reduce((acc: number, vale: IVale) => {
                  return acc + (vale.valor || 0);
                }, 0))
            );
          },
        },
      ],
    },
  ]);

  const exportar = () => {
    const data: INominaCobrador[] = [];
    gridRef.current.api.forEachNode((node: any) => data.push(node.data));
    console.log(data)
    exportarMensual(data);
  };

  return (
    <>
      {openModal && (
        <Modal
          content={contentModal}
          title={title}
          size={"max-w-2xl"}
        />
      )}
      <div>
        <div className="h-full w-full grid mt-4 border-l-4 border-sky-600">
          <div className="flex justify-between items-center p-2 bg-[#E5E5E7] border-sky-600 rounded-br">
            <div className="flex w-3/4 pr-2">
              <div className="flex flex-col mx-4">
                <p className="font-light"># Nómina</p>
                <p className="flex font-semibold">
                  <span className="text-sky-700 font-semibold mx-2">
                    {nomina_id}
                  </span>
                  <Search
                    size={20}
                    onClick={() => AbrirModal("buscarNomina")}
                    className="text-sky-600 hover:text-sky-800 ml-2 rounded transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col mx-4">
                <p className="font-light">Fecha</p>
                <p className="font-semibold">
                  {nombre} - {year}
                </p>
              </div>
            </div>
            <div className="w-1/4 pl-2 flex justify-end">
              <div className="flex space-x-2">
                <IconButton
                  //   disabled={disabled}
                  color="primary"
                  onClick={() => AbrirModal("agregarCobrador")}
                >
                  <Plus />
                </IconButton>
                <IconButton
                  disabled={list.length > 0 ? false : true}
                  color="primary"
                  onClick={() => handleGuardarNomina()}
                >
                  <Save />
                </IconButton>
                <IconButton
                  disabled={list.length > 0 ? false : true}
                  color="primary"
                  onClick={() => exportar()}
                >
                  <Printer />
                </IconButton>
              </div>
            </div>
          </div>
          <div className="bg-white">
            <div
              className="ag-theme-material"
              style={{ height }}
            >
              <AgGridReact<INominaCobrador>
                ref={gridRef}
                rowData={list}
                columnDefs={colDefs}
                rowHeight={30}
                defaultColDef={defaultColDef}
                suppressMovableColumns={true}
                onGridReady={onGridReady}
                rowDragManaged={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Nomina;
