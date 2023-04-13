const formData = <T extends object>(form: HTMLFormElement): T => {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries()) as T;
};

export default formData;
