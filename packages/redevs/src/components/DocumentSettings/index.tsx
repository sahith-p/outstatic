import Accordion from '@/components/Accordion'
import DateTimePicker from '@/components/DateTimePicker'
import DeleteDocumentButton from '@/components/DeleteDocumentButton'
import DocumentSettingsImageSelection from '@/components/DocumentSettingsImageSelection'
import Input from '@/components/Input'
import TagInput from '@/components/TagInput'
import TextArea from '@/components/TextArea'
import { DocumentContext } from '@/context'
import {
  CustomFieldArrayValue,
  CustomFields,
  isArrayCustomField
} from '@/types'
import { PanelRight, PanelRightClose } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { slugify } from 'transliteration'

type DocumentSettingsProps = {
  saveFunc: () => void
  loading: boolean
  registerOptions?: RegisterOptions
  showDelete: boolean
  customFields?: CustomFields
}

interface CustomInputProps {
  type?: 'text' | 'number'
  suggestions?: CustomFieldArrayValue[]
  registerOptions?: RegisterOptions
}

type ComponentType = {
  component: typeof Input | typeof TextArea | typeof TagInput
  props: CustomInputProps
}

type FieldDataMapType = {
  String: ComponentType
  Text: ComponentType
  Number: ComponentType
  Tags: ComponentType
}

const FieldDataMap: FieldDataMapType = {
  String: { component: Input, props: { type: 'text' } },
  Text: { component: TextArea, props: {} },
  Number: { component: Input, props: { type: 'number' } },
  Tags: {
    component: TagInput,
    props: {
      suggestions: []
    }
  }
}

const DocumentSettings = ({
  saveFunc,
  loading,
  registerOptions,
  showDelete,
  customFields = {}
}: DocumentSettingsProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()
  const router = useRouter()
  const { document, editDocument, hasChanges, collection } =
    useContext(DocumentContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="absolute w-full items-center justify-between flex p-4 border-t-2 border-neutral-800 z-10 bottom-0 bg-black text-white md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-neutral-800 hover:ring-2 ring-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800 md:hidden"
        >
          {isOpen ? <PanelRightClose /> : <PanelRight />}
        </button>
        <div className="flex flex-end w-full items-center justify-end gap-4">
          <label htmlFor="status" className="sr-only">
            Status
          </label>
          <select
            {...register('status', registerOptions)}
            name="status"
            id="status"
            defaultValue={document.status}
            className="block cursor-pointer appearance-none rounded-lg bg-gray-50 p-2 py-2.5 text-sm text-gray-900 outline-none focus:border-neutral-700 focus:ring-border-neutral-700"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={saveFunc}
            type="button"
            disabled={loading || !hasChanges}
            className="flex rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-900"
          >
            {loading ? (
              <>
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
      <aside
        className={`${
          isOpen ? 'block absolute' : 'hidden relative'
        } md:block w-full text-white bg-neutral-900 md:w-64 md:flex-none md:flex-col md:flex-wrap md:items-start md:justify-start py-6 h-full max-h-[calc(100vh-128px)] md:max-h-[calc(100vh-53px)] scrollbar-hide overflow-scroll`}
      >
        <div className="relative w-full items-center justify-between mb-4 flex px-4">
          <DateTimePicker
            id="publishedAt"
            label="Date"
            date={document.publishedAt}
            setDate={(publishedAt) => editDocument('publishedAt', publishedAt)}
          />
        </div>
        <div className="hidden md:flex relative w-full items-center justify-between mb-4 px-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-white"
          >
            Status
          </label>
          <select
            {...register('status', registerOptions)}
            name="status"
            id="status"
            defaultValue={document.status}
            className="block cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-neutral-700 focus:ring-border-neutral-700"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div
          className={`flex w-full pb-4 px-4 ${
            showDelete ? 'justify-between items-center' : 'justify-end'
          }`}
        >
          {showDelete && (
            <DeleteDocumentButton
              disabled={loading}
              slug={document.slug}
              onComplete={() => {
                router.push(`/redevs/${collection}`)
              }}
              collection={collection}
              className="hover:bg-black max-h-[2.25rem]"
            />
          )}
          <button
            onClick={saveFunc}
            type="button"
            disabled={loading || !hasChanges}
            className="hidden md:flex rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:bg-black"
          >
            {loading ? (
              <>
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
        <div className="w-full">
          <Accordion title="Author">
            <label className="text-white text-sm mb-1 font-medium">Name</label>
            <Input
              name="author.name"
              id="author.name"
              defaultValue={document.author?.name ?? ''}
              inputSize="small"
              wrapperClass="mb-4"
            />
            <label className="text-white text-sm mb-1 font-medium">
              Add an avatar
            </label>
            <DocumentSettingsImageSelection
              name="author.picture"
              description="Author Avatar"
            />
          </Accordion>
          <Accordion title="URL Slug">
            <label className="text-white text-sm mb-1 font-medium">
              Write a slug (optional)
            </label>
            <Input
              name="slug"
              id="slug"
              defaultValue={document.slug}
              inputSize="small"
              registerOptions={{
                onChange: (e) => {
                  const lastChar = e.target.value.slice(-1)
                  editDocument(
                    'slug',
                    lastChar === ' ' || lastChar === '-'
                      ? e.target.value
                      : slugify(e.target.value, { allowedChars: 'a-zA-Z0-9' })
                  )
                }
              }}
            />
          </Accordion>
          <Accordion title="Description">
            <label className="text-white text-sm mb-1 font-medium">
              Write a description (optional)
            </label>
            <TextArea
              name="description"
              type="textarea"
              id="description"
              rows={5}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-neutral-700 focus:ring-border-neutral-700"
            />
          </Accordion>

          <Accordion title="Cover Image">
            <DocumentSettingsImageSelection
              name="coverImage"
              description="Cover Image"
            />
          </Accordion>
          {customFields &&
            Object.entries(customFields).map(([name, field]) => {
              const Field = FieldDataMap[field.fieldType]
              if (isArrayCustomField(field)) {
                Field.props.suggestions = field.values
              }

              // Fix for NaN error when saving a non-required number
              if (field.fieldType === 'Number' && !field.required) {
                Field.props = {
                  ...Field.props,
                  registerOptions: {
                    setValueAs: (value: any) =>
                      isNaN(value) ? undefined : Number(value)
                  }
                }
              }
              return (
                <Accordion
                  key={name}
                  title={`${field.title}${field.required ? '*' : ''}`}
                  error={!!errors[name]?.message}
                >
                  <Field.component
                    id={name}
                    label={field.description}
                    {...Field.props}
                  />
                </Accordion>
              )
            })}
        </div>
      </aside>
    </>
  )
}

export default DocumentSettings
