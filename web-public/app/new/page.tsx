"use client"
import Button from "@/components/NewLanding/Button";
import Highlight from "@/components/NewLanding/Highlight";
import Title from "@/components/NewLanding/Title";
import UseCase from "@/components/NewLanding/UseCase";
import { ComponentProps, useState } from "react";
import { BiBookContent, BiHash, BiLink, BiMath, BiSearchAlt } from "react-icons/bi";
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

const NewLandingPage = () => {
  const [activeItem, setActiveItem] = useState("organize");
  
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

        <Title className="mt-24 mb-10">
          For all your <Highlight bottom={-10}>academic</Highlight> needs!
        </Title>

        <UseCase.Container>
          <UseCase.Column>
            <UseCase.Items>
              <li onClick={() => setActiveItem("organize")}>
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
              <li onClick={() => setActiveItem("link-notes")}>
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
              <li onClick={() => setActiveItem("search")}>
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
              <li onClick={() => setActiveItem("outline")}>
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
            </UseCase.Items>
          </UseCase.Column>
          <UseCase.Column></UseCase.Column>
        </UseCase.Container>
      </div>
    </div>
  );
};

export default NewLandingPage;
