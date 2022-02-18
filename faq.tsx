import {
  MetaContentFragment,
  MetaContentHead,
  MetaContentProps,
} from '@/components/common/MetaContentHead'
import { HeaderBlock } from '@/components/pageBlocks/HeaderBlock'
import { Layout } from '@/components/Layout'
import { AccordionPanel } from '@/components/ui/AccordionPanel'
import { fetchContent } from '@/utils/Contentful'

export type FAQsPageProps = {
  page: {
    title: string
    metaContent: MetaContentProps
    questionGroupsCollection: {
      items: [QuestionGroupProps]
    }
  }
}

export type QuestionGroupProps = {
  title: string
  questionsCollection: {
    items: [QuestionProps]
  }
}

export type QuestionProps = {
  title: string
  answer: {
    json: any
  }
}

const FAQs = ({ page }: FAQsPageProps): JSX.Element => {
  return (
    <Layout>
      <MetaContentHead {...page.metaContent} />

      <HeaderBlock {...{ title: page.title }} />

      {page.questionGroupsCollection?.items.map(
        (questionGroup: QuestionGroupProps, i) => (
          <section className="pb-12 lg:pb-16" key={`QuestionGroup_${i}`}>
            <div className="pb-4 m-auto lg:pb-6">
              <h2 className="__fora-text-h6-sans text-charcoal lg:text-center">
                {questionGroup.title}
              </h2>
            </div>

            <div className="max-w-3xl m-auto">
              {questionGroup.questionsCollection.items.map(
                (question: QuestionProps, n: number) => (
                  <AccordionPanel
                    key={`Question_${n}`}
                    headline={question.title}
                    richText={question.answer.json}
                  />
                )
              )}
            </div>
          </section>
        )
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const response = await fetchContent(`
    {
      templateFaqsCollection(limit: 1) {
        items {
          title
          ${MetaContentFragment}
          questionGroupsCollection {
            items {
              title
              questionsCollection {
                items {
                  title
                  answer {
                    json
                  }
                }
              }
            }
          }
        }
      }
    }
  `)
  return {
    props: {
      page: response.templateFaqsCollection.items[0],
    },
  }
}

export default FAQs
