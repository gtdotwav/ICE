"use client"

import { UploadCloud, X } from "lucide-react"
import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { twMerge } from "tailwind-merge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type InputProps = {
  width: number
  height: number
  className?: string
  value?: File | string
  onChange?: (file?: File) => void
  disabled?: boolean
  dropzoneOptions?: DropzoneOptions
}

const ImageUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({ dropzoneOptions, width, height, value, className, disabled, onChange }, ref) => {
    const [file, setFile] = React.useState<File | string | null>(value || null)
    const [preview, setPreview] = React.useState<string | null>(typeof value === "string" ? value : null)

    React.useEffect(() => {
      if (typeof value === "string") {
        setPreview(value)
        setFile(value)
      } else if (value instanceof File) {
        setFile(value)
        setPreview(URL.createObjectURL(value))
      } else {
        setFile(null)
        setPreview(null)
      }
    }, [value])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0]
        if (newFile) {
          setFile(newFile)
          setPreview(URL.createObjectURL(newFile))
          onChange?.(newFile)
        }
      },
      [onChange],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      maxFiles: 1,
      ...dropzoneOptions,
    })

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      setFile(null)
      setPreview(null)
      onChange?.(undefined)
    }

    return (
      <div>
        <Label htmlFor="image-upload">Imagem Principal</Label>
        <div
          {...getRootProps()}
          className={twMerge(
            "group relative mt-1 flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center",
            isDragActive && "border-primary",
            className,
          )}
          style={{ width, height }}
        >
          <Input {...getInputProps()} ref={ref} id="image-upload" />
          {preview ? (
            <div className="relative h-full w-full">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remover imagem"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Arraste e solte ou <span className="font-semibold text-primary">clique para enviar</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">PNG, JPG, WEBP até 2MB</p>
            </div>
          )}
        </div>
      </div>
    )
  },
)

ImageUpload.displayName = "ImageUpload"
export { ImageUpload }
