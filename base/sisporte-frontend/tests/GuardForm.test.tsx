import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuardForm } from "../components/GuardForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("GuardForm Field Limits and Masks", () => {
  test("all main form inputs should have a maxLength attribute", () => {
    render(<GuardForm />);
    const inputs = screen.getAllByRole("textbox");

    const inputsWithoutMaxLength = inputs.filter((input) => {
      const name = input.getAttribute("name");
      if (!name) return false;

      const criticalFields = [
        "name",
        "cpf",
        "rg",
        "registrationNumber",
        "address",
        "filiation1",
        "filiation2",
      ];

      return (
        criticalFields.includes(name) &&
        (input as HTMLInputElement).maxLength <= 0
      );
    });

    if (inputsWithoutMaxLength.length > 0) {
      const names = inputsWithoutMaxLength.map((i) => i.getAttribute("name"));
      throw new Error(`Fields missing maxLength: ${names.join(", ")}`);
    }
  });

  test('CPF mask should work correctly', () => {
    render(<GuardForm />);
    const cpfInput = screen.getByLabelText(/CPF/i) as HTMLInputElement;
    
    fireEvent.change(cpfInput, { target: { value: '12345678901' } });
    expect(cpfInput.value).toBe('123.456.789-01');
  });

  test('Date mask should work correctly', () => {
    render(<GuardForm />);
    const dateInput = screen.getByLabelText(/Data de Nascimento/i) as HTMLInputElement;
    
    fireEvent.change(dateInput, { target: { value: '01012000' } });
    expect(dateInput.value).toBe('01/01/2000');
  });

  test('Registration Number mask should work correctly', () => {
    render(<GuardForm />);
    const regInput = screen.getByLabelText(/Matrícula/i) as HTMLInputElement;
    
    fireEvent.change(regInput, { target: { value: '1234567' } });
    expect(regInput.value).toBe('123.456-7');
  });

  test('CEP mask should work correctly', () => {
    render(<GuardForm />);
    const cepInput = screen.getByLabelText(/CEP/i) as HTMLInputElement;
    
    fireEvent.change(cepInput, { target: { value: '12345678' } });
    expect(cepInput.value).toBe('12345-678');
  });

  test('should show validation error for short names', async () => {
    render(<GuardForm />);
    const nameInput = screen.getByLabelText(/Nome Completo/i) as HTMLInputElement;
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(nameInput, { target: { value: 'Ab' } });
    fireEvent.click(submitButton);

    const errorMsg = await screen.findByText(/Nome Completo deve ter pelo menos 3 caracteres/i);
    expect(errorMsg).toBeInTheDocument();
  });

  test('should show validation error for invalid CPF', async () => {
    render(<GuardForm />);
    const cpfInput = screen.getByLabelText(/CPF/i) as HTMLInputElement;

    fireEvent.change(cpfInput, { target: { value: '11111111111' } });
    fireEvent.blur(cpfInput);

    const errorMsg = await screen.findByText(/CPF inválido/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
