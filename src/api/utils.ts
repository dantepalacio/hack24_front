export const readFile = (file: File) =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = (e) => resolve(e.target?.result)
        fileReader.onerror = (e) => reject(e.target?.result)
    })

const MB = 1024 * 1024

export const getFile = async (file: File) => {
    if (file.type.startsWith("video/") && file.size > 25 * MB)
        throw Error("Слишком большой файл")
    const src = await readFile(file)

    if (!src) throw Error("Не удалось прочитать файл")

    return {
        src: `${src}`,
        type: file.type,
    }
}
