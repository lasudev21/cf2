import { useEffect, useState } from "react";
import { ICliente, IClientes, IErrorsCliente } from "../../../types/ICliente";
import FloatingLabel from "../../../components/Common/FloatingLabel";
import { useDashboardStore } from "../../../store/DashboardStore";
import { postCliente, putCliente } from "../../../services/clienteService";
import { useClienteStore } from "../../../store/ClienteStore";
import { TypeToastEnum } from "../../../types/IToast";

interface DrawerProps {
  cliente: ICliente;
}

const Setting: React.FC<DrawerProps> = ({ cliente }) => {
  const { setData } = useClienteStore();
  const { toggleDrawer, setErrorsToast, setLoader } = useDashboardStore();

  useEffect(() => {
    setLoader(false);
  }, []);

  const [formData, setFormData] = useState<ICliente>(cliente);

  const [errors, setErrors] = useState<Partial<IErrorsCliente>>({});

  const handleInputChange = (property: string, newValue: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [property]: newValue,
    }));
  };

  const validate = () => {
    const errors: Partial<IErrorsCliente> = {};

    if (!formData?.titular)
      errors.titular = "El nombre del titular es obligatorio";

    if (!formData?.cc_titular)
      errors.cc_titular = "La identificación del titular es obligatoria";

    if (!formData?.fiador)
      errors.fiador = "El nombre del fiador es obligatorio";

    if (!formData?.cc_fiador)
      errors.cc_fiador = "La identificación del fiador es obligatoria";

    if (!formData?.neg_titular)
      errors.neg_titular = "El negocio del titular es obligatorio";

    if (!formData?.neg_fiador)
      errors.neg_fiador = "El negocio del fiador es obligatorio";

    if (!formData?.dir_cobro)
      errors.dir_cobro = "La dirección de cobro es obligatoria";
    if (!formData?.barrio_cobro)
      errors.barrio_cobro = "El barrio de cobro es obligatorio";
    if (!formData?.tel_cobro)
      errors.tel_cobro = "El teléfono de cobro es obligatorio";

    if (!formData?.dir_casa)
      errors.dir_casa = "La dirección de casa es obligatoria";
    if (!formData?.barrio_casa)
      errors.barrio_casa = "El barrio de casa es obligatorio";
    if (!formData?.tel_casa)
      errors.tel_casa = "El teléfono de casa es obligatorio";

    if (!formData?.dir_fiador)
      errors.dir_fiador = "La dirección del fiador es obligatoria";
    if (!formData?.barrio_fiador)
      errors.barrio_fiador = "El barrio del fiador es obligatorio";
    if (!formData?.tel_fiador)
      errors.tel_fiador = "El teléfono del fiador es obligatorio";

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoader(true);

    const data: IClientes | null =
      formData.id === 0
        ? await postCliente(formData)
        : await putCliente(formData);

    if (data) {
      setErrorsToast([
        {
          message: "Cliente gestionado",
          type: TypeToastEnum.Susccess,
        },
      ]);
      toggleDrawer(false);
      setData(data);
    }
    setLoader(false);
  };

  return (
    <div className="sm:p-4 md:p-4">
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <p className="text-xl text-sky-500 font-extralight italic dark:text-white">
          Información titular
        </p>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FloatingLabel
              property={"titular"}
              type="text"
              label="Titular"
              value={formData.titular ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-2">
            <FloatingLabel
              property={"cc_titular"}
              type="number"
              label="Identificación Titular"
              value={formData.cc_titular ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-6">
            <FloatingLabel
              property={"neg_titular"}
              type="text"
              label="Negocio Titular"
              value={formData.neg_titular ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"dir_cobro"}
              type="text"
              label="Dirección de cobro"
              value={formData.dir_cobro ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"barrio_cobro"}
              type="text"
              label="Barrio"
              value={formData.barrio_cobro ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"tel_cobro"}
              type="number"
              label="Teléfono"
              value={formData.tel_cobro ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"dir_casa"}
              type="text"
              label="Dirección Casa"
              value={formData.dir_casa ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"barrio_casa"}
              type="text"
              label="Barrio"
              value={formData.barrio_casa ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"tel_casa"}
              type="number"
              label="Teléfono"
              value={formData.tel_casa ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
        </div>

        <p className="text-xl text-sky-500 font-extralight italic dark:text-white">
          Información fiador
        </p>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FloatingLabel
              property={"fiador"}
              type="text"
              label="Fiador"
              value={formData.fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-2">
            <FloatingLabel
              property={"cc_fiador"}
              type="number"
              label="Identificación Fiador"
              value={formData.cc_fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-6">
            <FloatingLabel
              property={"neg_fiador"}
              type="text"
              label="Negocio Fiador"
              value={formData.neg_fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>

          <div className="col-span-4">
            <FloatingLabel
              property={"dir_fiador"}
              type="text"
              label="Dirección Fiador"
              value={formData.dir_fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"barrio_fiador"}
              type="text"
              label="Barrio"
              value={formData.barrio_fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
          <div className="col-span-4">
            <FloatingLabel
              property={"tel_fiador"}
              type="number"
              label="Teléfono"
              value={formData.tel_fiador ?? ""}
              action={handleInputChange}
              errors={errors}
              disabled={false}
            />
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {formData.id === 0 ? "Guardar" : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
