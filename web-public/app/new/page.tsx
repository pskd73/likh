"use client";
import Button from "@/components/NewLanding/Button";
import Highlight from "@/components/NewLanding/Highlight";
import Title from "@/components/NewLanding/Title";
import UseCase from "@/components/NewLanding/UseCase";
import classNames from "classnames";
import React from "react";
import { ComponentProps, useEffect, useState } from "react";
import {
  BiBookContent,
  BiChevronLeft,
  BiChevronRight,
  BiCodeAlt,
  BiExport,
  BiHash,
  BiImage,
  BiLink,
  BiLock,
  BiMath,
  BiSearchAlt,
  BiShareAlt,
} from "react-icons/bi";
import { BsMarkdownFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const P = ({ className, children, ...restProps }: ComponentProps<"p">) => {
  return (
    <p
      className={twMerge(className, "text-xl max-w-lg text-center font-light")}
      {...restProps}
    >
      {children}
    </p>
  );
};

const usecases = [
  { prefix: "For all your", highlight: "academic", postfix: "needs!" },
  { prefix: "For all your", highlight: "research", postfix: "needs!" },
  { prefix: "For all your", highlight: "blogging", postfix: "needs!" },
  { prefix: "For all your", highlight: "writing", postfix: "needs!" },
];

const NewLandingPage = () => {
  const [activeItem, setActiveItem] = useState<string>();
  const [activeUsecase, setActiveUsecase] = useState(0);

  const handleUsecaseClick = ({ prev }: { prev?: boolean }) => {
    let next = activeUsecase + 1;
    if (prev) {
      next = activeUsecase - 1;
    }
    if (next < 0) {
      next = usecases.length - 1;
    } else if (next > usecases.length - 1) {
      next = 0;
    }
    setActiveUsecase(next);
  };

  return (
    <div className="bg-base text-primary-700 p-10">
      <div className="flex flex-col items-center">
        <Title>
          Writing made <Highlight>easy</Highlight> for the web!
        </Title>

        <P className="py-4">
          A simple markdown based writing app that let’s you write and port to
          all other requirements
        </P>

        <p className="py-8">
          <Button>Start writing</Button>
          <P className="mt-2">No login required</P>
        </p>

        <p className="max-w-[1000px] py-10">
          <img
            src="/preview.png"
            className="rounded-lg"
            style={{ boxShadow: "0px 0px 37px 0px rgba(0, 0, 0, 0.25)" }}
          />
        </p>

        {usecases.map((usecase, i) => (
          <Title
            key={i}
            className={classNames("mt-24 mb-14", {
              hidden: activeUsecase !== i,
            })}
          >
            {usecase.prefix}
            <Highlight.NavBtn
              left
              onClick={() => handleUsecaseClick({ prev: true })}
            >
              <BiChevronLeft className="inline" />
            </Highlight.NavBtn>
            <Highlight
              bottom={-10}
              className="cursor-pointer"
              onClick={() => handleUsecaseClick({})}
            >
              {usecase.highlight}
            </Highlight>
            <Highlight.NavBtn right onClick={() => handleUsecaseClick({})}>
              <BiChevronRight className="inline" />
            </Highlight.NavBtn>
            {usecase.postfix}
          </Title>
        ))}

        <UseCase.Container>
          <UseCase.Column>
            <UseCase.Items>
              <li
                onClick={() => setActiveItem("organize")}
                className={classNames({
                  hidden: !["academic"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "organize"}>
                  <UseCase.Item.Icon>
                    <BiHash />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Organize</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("link-notes")}
                className={classNames({
                  hidden: !["academic", "research", "writing"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "link-notes"}>
                  <UseCase.Item.Icon>
                    <BiLink />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Link notes</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("search")}
                className={classNames({
                  hidden: !["academic"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "search"}>
                  <UseCase.Item.Icon>
                    <BiSearchAlt />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Search</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("outline")}
                className={classNames({
                  hidden: !["academic"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "outline"}>
                  <UseCase.Item.Icon>
                    <BiBookContent />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Outline</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("e2e")}
                className={classNames({
                  hidden: !["research", "writing"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "e2e"}>
                  <UseCase.Item.Icon>
                    <BiLock />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>E2E encryption</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("images")}
                className={classNames({
                  hidden: !["research", "blogging"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "images"}>
                  <UseCase.Item.Icon>
                    <BiImage />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Images</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("code")}
                className={classNames({
                  hidden: !["blogging"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "code"}>
                  <UseCase.Item.Icon>
                    <BiCodeAlt />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Code blocks</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("markdown")}
                className={classNames({
                  hidden: !["blogging", "writing"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "markdown"}>
                  <UseCase.Item.Icon>
                    <BsMarkdownFill />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Pure markdown</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("export")}
                className={classNames({
                  hidden: !["writing"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "export"}>
                  <UseCase.Item.Icon>
                    <BiExport />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Full export</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("math")}
                className={classNames({
                  hidden: !["research"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "math"}>
                  <UseCase.Item.Icon>
                    <BiMath />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Math expressions</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>

              <li
                onClick={() => setActiveItem("share")}
                className={classNames({
                  hidden: !["blogging"].includes(
                    usecases[activeUsecase].highlight
                  ),
                })}
              >
                <UseCase.Item active={activeItem === "share"}>
                  <UseCase.Item.Icon>
                    <BiShareAlt />
                  </UseCase.Item.Icon>
                  <UseCase.Item.Content>
                    <UseCase.Item.Title>Quick share</UseCase.Item.Title>
                    <UseCase.Item.Description>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </UseCase.Item.Description>
                  </UseCase.Item.Content>
                </UseCase.Item>
              </li>
            </UseCase.Items>
          </UseCase.Column>
          <UseCase.Column>
            <UseCase.ImgContainer visible={activeItem === "organize"}>
              <UseCase.Img
                src="/usecases/organize-plain.png"
                className="-rotate-[15deg] top-[50px] left-[40px]"
              />
              <UseCase.Img
                src="/usecases/organize-expanded.png"
                className="rotate-[8deg] left-[180px]"
              />
            </UseCase.ImgContainer>

            <UseCase.ImgContainer visible={activeItem === "link-notes"}>
              <UseCase.Img
                src="/usecases/link-graph.png"
                className="-rotate-[15deg] top-[50px] left-[40px]"
              />
              <UseCase.Img
                src="/usecases/link-add.png"
                className="rotate-[8deg] top-[260px] left-[80px] max-w-[80%]"
              />
            </UseCase.ImgContainer>
          </UseCase.Column>
        </UseCase.Container>
      </div>
    </div>
  );
};

export default NewLandingPage;
